import { prisma } from '../utils/db';
import { EvaluationTask, EvaluationResult } from '../types/evaluation.ts';

export async function createTask(data: {
  model_id: string;
  dataset_id: string;
  config?: Record<string, any>;
}): Promise<EvaluationTask> {
  return await prisma.evaluationTask.create({
    data: {
      modelId: data.model_id,
      datasetId: data.dataset_id,
      config: data.config,
      status: 'PENDING'
    }
  });
}

export async function getTasks(filters?: {
  model_id?: string;
  dataset_id?: string;
  status?: string;
}): Promise<EvaluationTask[]> {
  return await prisma.evaluationTask.findMany({
    where: {
      modelId: filters?.model_id,
      datasetId: filters?.dataset_id,
      status: filters?.status,
    },
    include: {
      model: true,
      dataset: true,
    }
  });
}

export async function getTask(id: string): Promise<EvaluationTask | null> {
  return await prisma.evaluationTask.findUnique({
    where: { id },
    include: {
      model: true,
      dataset: true,
    }
  });
}

export async function getResult(taskId: string): Promise<EvaluationResult | null> {
  const task = await prisma.evaluationTask.findUnique({
    where: { id: taskId },
    include: {
      results: true,
    }
  });
  return task?.results || null;
}

export async function cancelTask(id: string): Promise<EvaluationTask> {
  return await prisma.evaluationTask.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });
}