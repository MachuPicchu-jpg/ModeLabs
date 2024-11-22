export interface EvaluationTask {
    id: string;
    modelId: string;
    datasetId: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    config?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface EvaluationResult {
    id: string;
    taskId: string;
    metrics: Record<string, number>;
    details?: Record<string, any>;
    createdAt: Date;
  }