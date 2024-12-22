import os
import json
from firebase_admin import credentials, firestore, initialize_app
import datasets
from tqdm import tqdm
import requests
import time
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# Initialize Firebase with environment variables
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n') if os.getenv('FIREBASE_PRIVATE_KEY') else None,
    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
    "token_uri": "https://oauth2.googleapis.com/token",
})
initialize_app(cred)
db = firestore.client()

def initialize_evaluation_system():
    """Initialize the evaluation system and evaluate all models that need evaluation."""
    print("Starting evaluation system initialization...")
    try:
        evaluate_model()  # This will evaluate all models
        print("Evaluation system initialization completed successfully")
    except Exception as e:
        print(f"Failed to initialize evaluation system: {e}")
        raise

def check_model_evaluation_status(model_id):
    """Check if a model has been evaluated by looking at Firebase rankings"""
    try:
        # Check language model rankings
        lang_doc = db.collection('language-models').document(model_id).get()
        if lang_doc.exists:
            data = lang_doc.to_dict()
            # Only consider evaluated if all scores are present and non-zero
            return all(data.get(field, 0) > 0 for field in ['mathematics', 'coding', 'knowledge_usage', 'organization'])
        
        # Check multimodal model rankings
        multi_doc = db.collection('multimodal-models').document(model_id).get()
        if multi_doc.exists:
            data = multi_doc.to_dict()
            # Only consider evaluated if all scores are present and non-zero
            return all(data.get(field, 0) > 0 for field in ['visual_recognition', 'audio_processing', 'text_understanding', 'integration'])
        
        return False
    except Exception as e:
        print(f"Error checking evaluation status: {e}")
        return False

def evaluate_model(model_id=None):
    """Evaluate a specific model or all models if no ID is provided"""
    try:
        print("\nFetching models from Firebase...")
        model_list = []

        # Fetch language models
        lang_models_ref = db.collection('language-models')
        if model_id:
            model = lang_models_ref.document(model_id).get()
            if model.exists:
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Large Language'
                model_list.append(data)
        else:
            # Fetch all language models
            for model in lang_models_ref.stream():
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Large Language'
                model_list.append(data)

            # Fetch all multimodal models
            multi_models_ref = db.collection('multimodal-models')
            for model in multi_models_ref.stream():
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Multimodal'
                model_list.append(data)

        if not model_list:
            print("No models found in Firebase")
            return

        for model in model_list:
            print(f"\nEvaluating model: {model.get('model_name', 'Unknown')}")
            
            # Load evaluation datasets
            gsm8k = datasets.load_dataset("gsm8k", "main", split="test")
            mmlu = datasets.load_dataset("cais/mmlu", "high_school_mathematics", split="test")
            
            # Convert datasets to lists for easier handling
            gsm8k_data = list(gsm8k)[:10]
            mmlu_data = list(mmlu)[:10]

            # Initialize scores
            scores = {
                'mathematics': 0,
                'coding': 0,
                'knowledge_usage': 0,
                'organization': 0,
                'visual_recognition': 0,
                'audio_processing': 0,
                'text_understanding': 0,
                'integration': 0
            }

            # Evaluate on GSM8K for mathematics
            print("\nEvaluating mathematics capability...")
            total_math = 0
            correct_math = 0
            for example in tqdm(gsm8k_data, desc="Math problems"):
                try:
                    question = example['question']
                    answer = example['answer']
                    response = evaluate_example(model, f"Solve this math problem step by step and provide the final answer as a number:\n\n{question}")
                    print(f"\nModel response: {response}")
                    
                    numbers = re.findall(r'\d+', response)
                    predicted_answer = numbers[-1] if numbers else None
                    answer_numbers = re.findall(r'\d+', answer)
                    correct_answer = answer_numbers[-1] if answer_numbers else None
                    
                    if predicted_answer and correct_answer and predicted_answer == correct_answer:
                        correct_math += 1
                    total_math += 1
                except Exception as e:
                    print(f"Error in math evaluation: {e}")
            
            scores['mathematics'] = correct_math / total_math if total_math > 0 else 0

            # Evaluate on MMLU for knowledge
            print("\nEvaluating knowledge usage...")
            total_knowledge = 0
            correct_knowledge = 0
            for example in tqdm(mmlu_data, desc="Knowledge problems"):
                try:
                    question = example['question']
                    choices = example['choices']
                    correct_answer_idx = example['answer']
                    
                    formatted_prompt = f"Answer this high school mathematics question by selecting ONLY ONE LETTER (A, B, C, or D).\nQuestion: {question}\nChoices:\n"
                    for i, choice in enumerate(choices):
                        formatted_prompt += f"{chr(65 + i)}. {choice}\n"
                    formatted_prompt += "\nAnswer:"
                    
                    response = evaluate_example(model, formatted_prompt)
                    print(f"\nModel response: {response}")
                    
                    answer_match = re.search(r'[ABCD]', response.upper())
                    if answer_match:
                        predicted_answer = answer_match.group(0)
                        correct_answer = chr(65 + correct_answer_idx)
                        if predicted_answer == correct_answer:
                            correct_knowledge += 1
                    total_knowledge += 1
                except Exception as e:
                    print(f"Error in knowledge evaluation: {e}")
            
            scores['knowledge_usage'] = correct_knowledge / total_knowledge if total_knowledge > 0 else 0

            # Calculate overall score and update rankings
            if model['model_type'] == 'Large Language':
                scores['overall_score'] = (scores['mathematics'] + scores['knowledge_usage']) / 2
                # Update language model rankings
                db.collection('language-model-rankings').document(model['id']).set({
                    'model_id': model['id'],
                    'model_name': model['model_name'],
                    'overall_score': scores['overall_score'],
                    'mathematics': scores['mathematics'],
                    'knowledge_usage': scores['knowledge_usage'],
                    'coding': scores['coding'],
                    'organization': scores['organization'],
                    'progress': 1.0,
                    'updated_at': firestore.SERVER_TIMESTAMP
                }, merge=True)
            else:
                scores['overall_score'] = (scores['visual_recognition'] + scores['text_understanding']) / 2
                # Update multimodal model rankings
                db.collection('multimodal-model-rankings').document(model['id']).set({
                    'model_id': model['id'],
                    'model_name': model['model_name'],
                    'overall_score': scores['overall_score'],
                    'visual_recognition': scores['visual_recognition'],
                    'audio_processing': scores['audio_processing'],
                    'text_understanding': scores['text_understanding'],
                    'integration': scores['integration'],
                    'progress': 1.0,
                    'updated_at': firestore.SERVER_TIMESTAMP
                }, merge=True)

            print(f"\nEvaluation completed. Scores: {json.dumps(scores, indent=2)}")

    except Exception as e:
        print(f"Error in evaluation process: {e}")
        raise e

def evaluate_example(model, prompt):
    """Evaluate a single example using the model's API"""
    try:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f"Bearer {model.get('api_token', '')}"
        }
        
        data = {
            'model': model.get('model_name', ''),
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'text',
                            'text': prompt
                        }
                    ]
                }
            ],
            'stream': True,
            'temperature': 0.7,
            'max_tokens': 800
        }
        
        # Ensure API URL is correct
        api_url = model['api_url'].rstrip('/')
        if not any(api_url.endswith(endpoint) for endpoint in ['/chat/completions', '/v1/chat/completions']):
            if '/v1' in api_url:
                api_url = f"{api_url}/chat/completions"
            else:
                api_url = f"{api_url}/v1/chat/completions"
        
        print(f"Making API request to: {api_url}")
        print(f"Request data: {json.dumps(data, indent=2)}")
        
        response = requests.post(
            api_url,
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            # Handle streaming response
            full_response = ""
            for line in response.iter_lines():
                if line:
                    try:
                        line_text = line.decode('utf-8')
                        if line_text.startswith('data: '):
                            line_text = line_text[6:]  # Remove 'data: ' prefix
                        if line_text.strip() == '[DONE]':
                            continue
                        json_response = json.loads(line_text)
                        if 'choices' in json_response and len(json_response['choices']) > 0:
                            delta = json_response['choices'][0].get('delta', {})
                            if isinstance(delta.get('content'), list):
                                for content in delta['content']:
                                    if content.get('type') == 'text':
                                        full_response += content.get('text', '')
                            elif 'content' in delta:
                                full_response += delta['content']
                    except json.JSONDecodeError:
                        continue
            return full_response
        else:
            print(f"API request failed with status code: {response.status_code}")
            print(f"Response content: {response.text}")
            print(f"Request headers: {headers}")
            return ""
            
    except Exception as e:
        print(f"Error in example evaluation: {e}")
        print(f"API URL: {model.get('api_url', 'Not provided')}")
        print(f"Model data: {json.dumps(model, indent=2)}")
        return ""

if __name__ == "__main__":
    model_id = input("Enter model ID to evaluate (or press Enter to evaluate all models): ").strip()
    if model_id:
        print(f"Initializing evaluation system for model {model_id}...")
    else:
        print("Initializing evaluation system for all models...")
    evaluate_model(model_id if model_id else None)