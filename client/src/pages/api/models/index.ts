// src/pages/api/models/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Model } from '../../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        // 这里实现获取模型列表的逻辑
        const models: Model[] = [
          {
            id: '1',
            name: 'GPT-4',
            type: 'text',
            version: '1.0',
            provider: 'OpenAI',
            description: 'Advanced language model',
            parameters: 175000000000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          // 添加更多模型...
        ];
        res.status(200).json(models);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch models' });
      }
      break;

    case 'POST':
      try {
        // 这里实现创建新模型的逻辑
        const newModel = req.body;
        // 验证和处理数据...
        res.status(201).json(newModel);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create model' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}