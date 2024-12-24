export interface LanguageModelRanking {
    id: string;
    model_id: string;
    model_name: string;
    overall_score: number;
    inference: number;
    mathematics: number;
    coding: number;
    knowledge_usage: number;
    organization: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface MultimodalModelRanking {
    id: string;
    model_id: string;
    model_name: string;
    overall_score: number;
    visual_recognition: number;
    audio_processing: number;
    text_understanding: number;
    integration: number;
    created_at: Date;
    updated_at: Date;
  }