import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as modelService from '../services/modelService';

export async function getModels(req: Request, res: Response) {
  const { type } = req.query;
  const models = await modelService.getModels(type as 'text' | 'multimodal');
  res.status(StatusCodes.OK).json(models);
}

export async function getModel(req: Request, res: Response) {
  const { id } = req.params;
  const model = await modelService.getModel(id);
  res.status(StatusCodes.OK).json(model);
}

export async function createModel(req: Request, res: Response) {
  const model = await modelService.createModel(req.body);
  res.status(StatusCodes.CREATED).json(model);
}

export async function updateModel(req: Request, res: Response) {
  const { id } = req.params;
  const model = await modelService.updateModel(id, req.body);
  res.status(StatusCodes.OK).json(model);
}