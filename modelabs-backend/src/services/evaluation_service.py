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
        lang_doc = db.collection('language-model-rankings').document(model_id).get()
        if lang_doc.exists:
            data = lang_doc.to_dict()
            # Check if all required fields in language model evaluation are > 0
            return all(data.get(field, 0) > 0 for field in ['mathematics', 'coding', 'knowledge_usage', 'organization'])
        
        # Check multimodal model rankings (if this collection exists in the future)
        multi_doc = db.collection('multimodal-model-rankings').document(model_id).get()
        if multi_doc.exists:
            data = multi_doc.to_dict()
            # Check if all required fields in multimodal model evaluation are > 0
            return all(data.get(field, 0) > 0 for field in ['visual_recognition', 'audio_processing', 'text_understanding', 'integration'])
        
        # If no valid document is found
        return False
    except Exception as e:
        print(f"Error checking evaluation status: {e}")
        return False

def evaluate_model(model_id=None):
    """Evaluate a specific model or all models if no ID is provided, skipping already evaluated models"""
    try:
        print("\nFetching models from Firebase...")
        model_list = []

        # Fetch language models
        lang_models_ref = db.collection('language-models')
        if model_id:
            # If specific model_id is provided
            model = lang_models_ref.document(model_id).get()
            if model.exists:
                # Check if model has already been evaluated
                if check_model_evaluation_status(model_id):
                    print(f"Model {model_id} has already been evaluated. Skipping...")
                    return
                
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Large Language'
                model_list.append(data)
        else:
            # Fetch all language models
            for model in lang_models_ref.stream():
                # Skip if already evaluated
                if check_model_evaluation_status(model.id):
                    print(f"Model {model.id} has already been evaluated. Skipping...")
                    continue
                
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Large Language'
                model_list.append(data)

            # Fetch all multimodal models
            multi_models_ref = db.collection('multimodal-models')
            for model in multi_models_ref.stream():
                # Skip if already evaluated
                if check_model_evaluation_status(model.id):
                    print(f"Model {model.id} has already been evaluated. Skipping...")
                    continue
                
                data = model.to_dict()
                data['id'] = model.id
                data['model_type'] = 'Multimodal'
                model_list.append(data)

        if not model_list:
            print("No models found that need evaluation")
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
        
        # Base payload structure
        data = {
            'model': model.get('model_name', ''),
            'stream': False,
            'max_tokens': 512,
            'stop': ["null"],
            'temperature': 0.7,
            'top_p': 0.7,
            'top_k': 50,
            'frequency_penalty': 0.5,
            'n': 1,
            'response_format': {"type": "text"}
        }

        # Different message format for LLM vs Multimodal
        if model['model_type'] == 'Large Language':
            data['messages'] = [{
                'role': 'user',
                'content': prompt
            }]
        else:
            # For multimodal models
            data['messages'] = [{
                'role': 'user',
                'content': [
                    {
                        'type': 'image_url',
                        'image_url': {
                            'url': prompt,  # Assuming prompt is an image URL for multimodal
                            'detail': 'auto'
                        }
                    }
                ]
            }]
        
        # Ensure API URL is correct
        api_url = model['api_url'].rstrip('/')
        if not any(api_url.endswith(endpoint) for endpoint in ['/chat/completions', '/v1/chat/completions']):
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
            response_data = response.json()
            if 'choices' in response_data and len(response_data['choices']) > 0:
                return response_data['choices'][0].get('message', {}).get('content', '')
            return ''
        else:
            print(f"API request failed with status code: {response.status_code}")
            print(f"Response content: {response.text}")
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