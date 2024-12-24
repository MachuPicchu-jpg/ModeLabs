import { prisma } from '../utils/db';
import { EvaluationTask, EvaluationResult } from '../types/evaluation.ts';
import { spawn } from 'child_process';
import * as path from 'path';

export async function runPythonEvaluation(modelId?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'run_evaluation.py');
    console.log('Running Python script:', pythonScript);
    const python = spawn('python3', [pythonScript]);
    
    // If modelId is provided, write it to the process
    if (modelId) {
      python.stdin.write(modelId + '\n');
    } else {
      python.stdin.write('\n');
    }
    python.stdin.end();

    // Handle output
    python.stdout.on('data', (data) => {
      console.log('Evaluation output:', data.toString());
    });

    python.stderr.on('data', (data) => {
      console.error('Evaluation error:', data.toString());
    });

    python.on('close', (code) => {
      if (code === 0) {
        console.log('Evaluation completed successfully');
        resolve();
      } else {
        reject(new Error(`Evaluation process exited with code ${code}`));
      }
    });
  });
}

export async function initializeEvaluationSystem(): Promise<void> {
  try {
    await runPythonEvaluation();
  } catch (error) {
    console.error('Error running evaluation:', error);
    throw error;
  }
}

export async function evaluateModel(modelId: string): Promise<void> {
  try {
    await runPythonEvaluation(modelId);
  } catch (error) {
    console.error('Error evaluating model:', error);
    throw error;
  }
}

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

export async function initializeLanguageModelRanking(model: any): Promise<void> {
  await prisma.languageModelRanking.upsert({
    where: {
      model_id: model.id
    },
    update: {
      model_name: model.name,
      overall_score: 0,
      inference: 0,
      mathematics: 0,
      coding: 0,
      knowledge_usage: 0,
      organization: 0
    },
    create: {
      model_id: model.id,
      model_name: model.name,
      overall_score: 0,
      inference: 0,
      mathematics: 0,
      coding: 0,
      knowledge_usage: 0,
      organization: 0
    }
  });
}