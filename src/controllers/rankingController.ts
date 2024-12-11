import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as leaderboardService from '../services/rankingService';

// 获取大语言模型排行榜
export async function getLanguageModelLeaderboard(req: Request, res: Response) {
  const { page = 1, pageSize = 10 } = req.query;  // 默认分页: 第1页，每页10条
  
  try {
    const leaderboard = await leaderboardService.getLanguageModelRanks(Number(page), Number(pageSize));
    res.status(StatusCodes.OK).json(leaderboard);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve leaderboard' });
  }
}

// 获取多模态模型排行榜
export async function getMultimodalModelLeaderboard(req: Request, res: Response) {
  const { page = 1, pageSize = 10 } = req.query;  // 默认分页: 第1页，每页10条
  
  try {
    const leaderboard = await leaderboardService.getMultimodelModelRanks(Number(page), Number(pageSize));
    res.status(StatusCodes.OK).json(leaderboard);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve leaderboard' });
  }
}
