import { Request, Response } from 'express';
import * as evaluationService from '../services/evaluationService';

export async function createTask(req: Request, res: Response) {
  const task = await evaluationService.createTask(req.body);
  res.status(201).json(task);
}

export async function getTasks(req: Request, res: Response) {
  const filters = {
    model_id: req.query.model_id as string,
    dataset_id: req.query.dataset_id as string,
    status: req.query.status as string,
  };
  const tasks = await evaluationService.getTasks(filters);
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const task = await evaluationService.getTask(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
}

export async function getResult(req: Request, res: Response) {
  const result = await evaluationService.getResult(req.params.id);
  if (!result) {
    res.status(404).json({ message: 'Result not found' });
    return;
  }
  res.json(result);
}

export async function cancelTask(req: Request, res: Response) {
  const task = await evaluationService.cancelTask(req.params.id);
  res.json(task);
}