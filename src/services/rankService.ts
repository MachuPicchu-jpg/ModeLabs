// services/rankService.js
import { prisma } from '../utils/db';
import { PrismaClient, LanguageModelRank, MultimodalModelRank } from '@prisma/client';
// 添加新的大语言模型排行榜记录
export async function addLanguageModelRank(modelName: string, overallScore: number, aspectScores: Record<string, number>): Promise<LanguageModelRank> {
    return await prisma.languageModelRank.create({
      data: {
        model_name: modelName,
        overall_score: overallScore,
        aspect_scores: aspectScores
      }
    });
  }
  
  // 添加新的多模态模型排行榜记录
  export async function addMultimodalModelRank(modelName: string, overallScore: number, aspectScores: Record<string, number>): Promise<MultimodalModelRank> {
    return await prisma.multimodalModelRank.create({
      data: {
        model_name: modelName,
        overall_score: overallScore,
        aspect_scores: aspectScores
      }
    });
  }
  
  // 获取所有大语言模型排行榜数据
  export async function getLanguageModelRanks(): Promise<LanguageModelRank[]> {
    return await prisma.languageModelRank.findMany();
  }
  
  // 获取所有多模态模型排行榜数据
  export async function getMultimodalModelRanks(): Promise<MultimodalModelRank[]> {
    return await prisma.multimodalModelRank.findMany();
  }
  
  // 更新大语言模型排行榜记录
  export async function updateLanguageModelRank(id: number, overallScore: number, aspectScores: Record<string, number>): Promise<LanguageModelRank> {
    return await prisma.languageModelRank.update({
      where: { id },
      data: { overall_score: overallScore, aspect_scores: aspectScores }
    });
  }
  
  // 更新多模态模型排行榜记录
  export async function updateMultimodalModelRank(id: number, overallScore: number, aspectScores: Record<string, number>): Promise<MultimodalModelRank> {
    return await prisma.multimodalModelRank.update({
      where: { id },
      data: { overall_score: overallScore, aspect_scores: aspectScores }
    });
  }
  
  // 删除大语言模型排行榜记录
  export async function deleteLanguageModelRank(id: number): Promise<LanguageModelRank> {
    return await prisma.languageModelRank.delete({
      where: { id }
    });
  }
  
  // 删除多模态模型排行榜记录
  export async function deleteMultimodalModelRank(id: number): Promise<MultimodalModelRank> {
    return await prisma.multimodalModelRank.delete({
      where: { id }
    });
  }