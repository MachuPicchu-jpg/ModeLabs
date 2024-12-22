import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as rankingService from '../services/rankingService';

export async function getLanguageModelRankings(req: Request, res: Response) {
  const rankings = await rankingService.getLanguageModelRankings();
  res.status(StatusCodes.OK).json(rankings);
}

export async function getMultimodalModelRankings(req: Request, res: Response) {
  const rankings = await rankingService.getMultimodalModelRankings();
  res.status(StatusCodes.OK).json(rankings);
}

export async function getLanguageModelRanking(req: Request, res: Response) {
  const { id } = req.params;
  const ranking = await rankingService.getLanguageModelRanking(id);
  res.status(StatusCodes.OK).json(ranking);
}

export async function getMultimodalModelRanking(req: Request, res: Response) {
  const { id } = req.params;
  const ranking = await rankingService.getMultimodalModelRanking(id);
  res.status(StatusCodes.OK).json(ranking);
}

export async function createLanguageModelRanking(req: Request, res: Response) {
  const ranking = await rankingService.createLanguageModelRanking(req.body);
  res.status(StatusCodes.CREATED).json(ranking);
}

export async function createMultimodalModelRanking(req: Request, res: Response) {
  const ranking = await rankingService.createMultimodalModelRanking(req.body);
  res.status(StatusCodes.CREATED).json(ranking);
}

export async function updateLanguageModelRanking(req: Request, res: Response) {
  const { id } = req.params;
  const ranking = await rankingService.updateLanguageModelRanking(id, req.body);
  res.status(StatusCodes.OK).json(ranking);
}

export async function updateMultimodalModelRanking(req: Request, res: Response) {
  const { id } = req.params;
  const ranking = await rankingService.updateMultimodalModelRanking(id, req.body);
  res.status(StatusCodes.OK).json(ranking);
}
