import os
import sys
from dotenv import load_dotenv
from services.evaluation_service import initialize_evaluation_system, evaluate_model

def main():
    # Load environment variables
    load_dotenv()
    
    try:
        # Check if evaluating a specific model or all models
        model_id = input("Enter model ID to evaluate (or press Enter to evaluate all models): ").strip()
        
        if model_id:
            print(f"\nInitializing evaluation system for model {model_id}...")
            evaluate_model(model_id)
        else:
            print("\nInitializing evaluation system for all models...")
            initialize_evaluation_system()
            
    except KeyboardInterrupt:
        print("\nEvaluation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nError during evaluation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 