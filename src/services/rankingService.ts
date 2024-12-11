import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取大语言模型排行榜
export async function getLanguageModelRanks(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  
  return prisma.languageModelRank.findMany({
    skip,
    take: pageSize,
    orderBy: {
      overall_score: 'desc',  // 按综合评分降序排列
    },
  });
}

// 获取多模态模型排行榜
export async function getMultimodelModelRanks(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;

  return prisma.multimodelModelRank.findMany({
    skip,
    take: pageSize,
    orderBy: {
      overall_score: 'desc',  // 按综合评分降序排列
    },
  });
}
