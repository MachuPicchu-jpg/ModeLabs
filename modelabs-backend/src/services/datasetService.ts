import { PrismaClient } from '@prisma/client';
import { Dataset } from '../types/dataset';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export class DatasetService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads/datasets');

  constructor() {
    // 确保上传目录存在
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async createDataset(data: Partial<Dataset>): Promise<Dataset> {
    // 确保文件路径存在
    if (data.path) {
      const fullPath = path.resolve(data.path);
      const exists = await fs.access(fullPath).then(() => true).catch(() => false);
      if (!exists) {
        throw new Error('File not found');
      }
    }

    return await prisma.dataset.create({
      data: {
        id: uuidv4(),
        name: data.name || '',
        type: data.type || 'text',
        path: data.path || '',
        size: data.size || 0,
        description: data.description,
        userId: data.userId || '',
        userEmail: data.userEmail || '',
        category: data.category || '',
        subCategory: data.subCategory || '',
        downloads: 0,
        visibility: data.visibility || 'public',
        status: data.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return await prisma.dataset.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getDataset(id: string): Promise<Dataset | null> {
    return await prisma.dataset.findUnique({
      where: { id }
    });
  }

  async updateDownloads(id: string): Promise<Dataset> {
    return await prisma.dataset.update({
      where: { id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });
  }

  async deleteDataset(id: string): Promise<void> {
    const dataset = await this.getDataset(id);
    if (dataset && dataset.path) {
      // 删除文件
      try {
        await fs.unlink(dataset.path);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    // 删除数据库记录
    await prisma.dataset.delete({
      where: { id }
    });
  }
}