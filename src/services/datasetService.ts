import { prisma } from '../utils/db';
import { Dataset } from '../types/dataset';
import fs from 'fs/promises';

export async function getDatasets(type?: 'text' | 'multimodal'): Promise<Dataset[]> {
  return await prisma.dataset.findMany({
    where: type ? { type } : undefined
  });
}

export async function getDataset(id: string): Promise<Dataset | null> {
  return await prisma.dataset.findUnique({
    where: { id }
  });
}

export async function uploadDataset(file: Express.Multer.File): Promise<Dataset> {
  // 这里添加文件处理逻辑
  const fileContent = await fs.readFile(file.path);
  
  const dataset = await prisma.dataset.create({
    data: {
      name: file.originalname,
      type: 'text', // 根据实际文件类型判断
      path: file.path,
      size: file.size
    }
  });

  return dataset;
}

export async function deleteDataset(id: string): Promise<void> {
  const dataset = await prisma.dataset.findUnique({
    where: { id }
  });

  if (dataset?.path) {
    await fs.unlink(dataset.path).catch(console.error);
  }

  await prisma.dataset.delete({
    where: { id }
  });
}