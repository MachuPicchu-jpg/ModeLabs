export interface Model {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    description?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Dataset {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    path: string;
    size: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface EvaluationTask {
    id: string;
    model_id: string;
    dataset_id: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    config?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface EvaluationResult {
    task_id: string;
    metrics: Record<string, number>;
    details?: Record<string, any>;
    created_at: Date;
  }