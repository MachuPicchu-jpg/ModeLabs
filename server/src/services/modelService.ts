import prisma from '../utils/prisma';
import { ApiError } from '../middlewares/errors';
import { StatusCodes } from 'http-status-codes';
import type { Model } from '../types';

export async function getModels(type?: 'text' | 'multimodal') {
    const where = type ? { type } : {};
    return prisma.model.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      }
    });
  }

export async function getModel(id: string) {
  const model = await prisma.model.findUnique({
    where: { id }
  });

  if (!model) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Model not found');
  }

  return model;
}

export async function createModel(data: Omit<Model, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.model.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
}

export async function updateModel(id: string, data: Partial<Model>) {
  const model = await prisma.model.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  });

  if (!model) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Model not found');
  }

  return model;
}