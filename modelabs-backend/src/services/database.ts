// services/database.ts
import prisma from '../lib/prisma'
import { Model, Dataset, EvaluationTask, EvaluationResult } from '../types/api'

export const ModelService = {
  // 创建模型
  async createModel(data: Omit<Model, 'id' | 'created_at' | 'updated_at'>) {
    return prisma.model.create({
      data: {
        name: data.name,
        type: data.type,
        version: data.version,
        provider: data.provider,
        description: data.description,
        parameters: data.parameters ? BigInt(data.parameters) : null,
      },
    })
  },

  // 获取所有模型
  async getModels(type?: 'text' | 'multimodal') {
    return prisma.model.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  },

  // 获取单个模型
  async getModel(id: string) {
    return prisma.model.findUnique({
      where: { id },
      include: {
        modelMetrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })
  },
}

export const DatasetService = {
  // 创建数据集
  async createDataset(data: Omit<Dataset, 'id' | 'created_at'>) {
    return prisma.dataset.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        size: data.size,
        format: data.format,
        storage_url: data.format,
      },
    })
  },

  // 获取数据集列表
  async getDatasets(type?: 'text' | 'multimodal') {
    return prisma.dataset.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  },
}

export const EvaluationService = {
  // 创建评测任务
  async createTask(data: {
    modelId: string
    datasetId: string
    config?: Record<string, any>
  }) {
    return prisma.evaluationTask.create({
      data: {
        modelId: data.modelId,
        datasetId: data.datasetId,
        status: 'pending',
        config: data.config || {},
      },
    })
  },

  // 更新任务状态
  async updateTaskStatus(
    taskId: string,
    status: string,
    error?: string
  ) {
    return prisma.evaluationTask.update({
      where: { id: taskId },
      data: {
        status,
        error,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
    })
  },

  // 保存评测结果
  async saveResults(taskId: string, results: any) {
    return prisma.evaluationResult.create({
      data: {
        taskId,
        metrics: results.metrics,
        sampleResults: results.samples,
      },
    })
  },
}