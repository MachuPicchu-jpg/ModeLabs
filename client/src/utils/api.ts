// src/utils/api.ts
import axios from 'axios';
import { Model, EvaluationTask, Dataset, EvaluationResult } from '../types/api';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });
  

// 模型相关API
export const modelApi = {
  // 获取所有模型
  getModels: async (type?: 'text' | 'multimodal') => {
    const response = await api.get<Model[]>('/models', {
      params: { type },
    });
    return response.data;
  },

  // 获取单个模型详情
  getModel: async (id: string) => {
    const response = await api.get<Model>(`/models/${id}`);
    return response.data;
  },

  // 添加新模型
  createModel: async (model: Omit<Model, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<Model>('/models', model);
    return response.data;
  },

  // 更新模型信息
  updateModel: async (id: string, model: Partial<Model>) => {
    const response = await api.put<Model>(`/models/${id}`, model);
    return response.data;
  },
};

// 评测任务相关API
export const evaluationApi = {
  // 创建评测任务
  createTask: async (data: {
    model_id: string;
    dataset_id: string;
    config?: Record<string, any>;
  }) => {
    const response = await api.post<EvaluationTask>('/evaluations', data);
    return response.data;
  },

  // 获取评测任务列表
  getTasks: async (filters?: {
    model_id?: string;
    dataset_id?: string;
    status?: EvaluationTask['status'];
  }) => {
    const response = await api.get<EvaluationTask[]>('/evaluations', {
      params: filters,
    });
    return response.data;
  },

  // 获取评测任务详情
  getTask: async (id: string) => {
    const response = await api.get<EvaluationTask>(`/evaluations/${id}`);
    return response.data;
  },

  // 获取评测结果
  getResult: async (taskId: string) => {
    const response = await api.get<EvaluationResult>(`/evaluations/${taskId}/result`);
    return response.data;
  },

  // 取消评测任务
  cancelTask: async (id: string) => {
    const response = await api.post(`/evaluations/${id}/cancel`);
    return response.data;
  },
};

// 数据集相关API
export const datasetApi = {
  // 获取数据集列表
  getDatasets: async (type?: 'text' | 'multimodal') => {
    const response = await api.get<Dataset[]>('/datasets', {
      params: { type },
    });
    return response.data;
  },

  // 获取数据集详情
  getDataset: async (id: string) => {
    const response = await api.get<Dataset>(`/datasets/${id}`);
    return response.data;
  },

  // 上传新数据集
  uploadDataset: async (formData: FormData) => {
    const response = await api.post<Dataset>('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 删除数据集
  deleteDataset: async (id: string) => {
    await api.delete(`/datasets/${id}`);
  },
};

// 批量评测和对比API
export const comparisonApi = {
  // 创建模型对比评测
  createComparison: async (data: {
    model_ids: string[];
    dataset_id: string;
    config?: Record<string, any>;
  }) => {
    const response = await api.post('/comparisons', data);
    return response.data;
  },

  // 获取对比评测结果
  getComparison: async (id: string) => {
    const response = await api.get(`/comparisons/${id}`);
    return response.data;
  },
};

api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // 处理后端返回的错误
        const message = error.response.data?.message || 'An error occurred';
        console.error('API Error:', message);
      } else if (error.request) {
        // 网络错误
        console.error('Network Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );