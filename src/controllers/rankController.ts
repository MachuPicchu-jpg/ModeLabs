// controllers/rankController.ts
import { Request, Response } from 'express';
import * as rankService from '../services/rankService';

// 创建大语言模型排行榜记录
export async function createLanguageModelRank(req: Request, res: Response): Promise<void> {
  const { modelName, overallScore, aspectScores } = req.body;
  
  try {
    const rank = await rankService.addLanguageModelRank(modelName, overallScore, aspectScores);
    res.status(201).json(rank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create language model rank.' });
  }
}

// 创建多模态模型排行榜记录
export async function createMultimodalModelRank(req: Request, res: Response): Promise<void> {
  const { modelName, overallScore, aspectScores } = req.body;
  
  try {
    const rank = await rankService.addMultimodalModelRank(modelName, overallScore, aspectScores);
    res.status(201).json(rank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create multimodal model rank.' });
  }
}

// 获取所有大语言模型排行榜数据
export async function getLanguageModelRanks(req: Request, res: Response): Promise<void> {
  try {
    const ranks = await rankService.getLanguageModelRanks();
    res.status(200).json(ranks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch language model ranks.' });
  }
}

// 获取所有多模态模型排行榜数据
export async function getMultimodalModelRanks(req: Request, res: Response): Promise<void> {
  try {
    const ranks = await rankService.getMultimodalModelRanks();
    res.status(200).json(ranks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch multimodal model ranks.' });
  }
}

// 更新大语言模型排行榜记录
export async function updateLanguageModelRank(req: Request, res: Response): Promise<void> {
  const { id, overallScore, aspectScores } = req.body;
  
  try {
    const updatedRank = await rankService.updateLanguageModelRank(id, overallScore, aspectScores);
    res.status(200).json(updatedRank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update language model rank.' });
  }
}

// 更新多模态模型排行榜记录
export async function updateMultimodalModelRank(req: Request, res: Response): Promise<void> {
  const { id, overallScore, aspectScores } = req.body;
  
  try {
    const updatedRank = await rankService.updateMultimodalModelRank(id, overallScore, aspectScores);
    res.status(200).json(updatedRank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update multimodal model rank.' });
  }
}

// 删除大语言模型排行榜记录
export async function deleteLanguageModelRank(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  
  try {
    await rankService.deleteLanguageModelRank(Number(id));
    res.status(200).json({ message: 'Language model rank deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete language model rank.' });
  }
}

// 删除多模态模型排行榜记录
export async function deleteMultimodalModelRank(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  
  try {
    await rankService.deleteMultimodalModelRank(Number(id));
    res.status(200).json({ message: 'Multimodal model rank deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete multimodal model rank.' });
  }
}
