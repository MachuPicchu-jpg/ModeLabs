// src/types/api.ts

// 模型类型
export interface Model {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    version: string;
    provider: string;
    description: string;
    parameters?: number;
    created_at: string;
    updated_at: string;
  }
  
  // 评测指标
  export interface Metrics {
    accuracy: number;
    latency: number;
    memory_usage: number;
    tokens_per_second?: number;
    gpu_utilization?: number;
    // 多模态特有指标
    image_understanding?: number;
    visual_accuracy?: number;
  }
  
  // 评测任务
  export interface EvaluationTask {
    id: string;
    model_id: string;
    dataset_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    metrics?: Metrics;
    created_at: string;
    completed_at?: string;
    error_message?: string;
  }
  
  // 数据集
  export interface Dataset {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    description: string;
    size: number;
    format: string;
    created_at: string;
  }
  
  // 评测结果
  export interface EvaluationResult {
    task_id: string;
    model_id: string;
    dataset_id: string;
    metrics: Metrics;
    samples: Array<{
      input: string | { text?: string; image_url?: string };
      expected_output: string;
      actual_output: string;
      is_correct: boolean;
      latency: number;
    }>;
    created_at: string;
  }