import prisma from '../utils/prisma';
import { ApiError } from '../middlewares/errors';
import { StatusCodes } from 'http-status-codes';
import { LanguageModelRanking, MultimodalModelRanking } from '../types/ranking';

export async function getLanguageModelRankings() {
  return prisma.languageModelRanking.findMany({
    orderBy: {
      overall_score: 'desc'
    }
  });
}

export async function getMultimodalModelRankings() {
  return prisma.multimodalModelRanking.findMany({
    orderBy: {
      overall_score: 'desc'
    }
  });
}

export async function getLanguageModelRanking(id: string) {
  const ranking = await prisma.languageModelRanking.findUnique({
    where: { id }
  });

  if (!ranking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Language model ranking not found');
  }

  return ranking;
}

export async function getMultimodalModelRanking(id: string) {
  const ranking = await prisma.multimodalModelRanking.findUnique({
    where: { id }
  });

  if (!ranking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Multimodal model ranking not found');
  }

  return ranking;
}

export async function createLanguageModelRanking(data: Omit<LanguageModelRanking, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.languageModelRanking.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
}

export async function createMultimodalModelRanking(data: Omit<MultimodalModelRanking, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.multimodalModelRanking.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
}

export async function updateLanguageModelRanking(id: string, data: Partial<LanguageModelRanking>) {
  const ranking = await prisma.languageModelRanking.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  });

  if (!ranking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Language model ranking not found');
  }

  return ranking;
}

export async function updateMultimodalModelRanking(id: string, data: Partial<MultimodalModelRanking>) {
  const ranking = await prisma.multimodalModelRanking.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  });

  if (!ranking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Multimodal model ranking not found');
  }

  return ranking;
}