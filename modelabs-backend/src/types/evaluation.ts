export interface DatasetExample {
  text: string;
  text2?: string;
  label: string;
}

export interface EvaluationTask {
  id: string;
  modelId: string;
  datasetId: string;
  status: string;
  config?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  model?: any;
  dataset?: any;
  results?: EvaluationResult;
}

export interface EvaluationResult {
  id: string;
  taskId: string;
  accuracy: number;
  inference: number;
  organization: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}