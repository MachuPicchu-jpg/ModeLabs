import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatasetService } from '../services/datasetService';
import fs from 'fs/promises';

const router = express.Router();
const datasetService = new DatasetService();

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/datasets/');
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = ['.json', '.jsonl', '.csv', '.xlsx', '.yaml', '.yml', '.tsv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// 在路由文件开头添加创建上传目录的函数
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'uploads/datasets');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// 在路由定义之前确保目录存在
ensureUploadDir();

// 添加获取所有数据集的路由
router.get('/', async (req: Request, res: Response) => {
  try {
    const datasets = await datasetService.getAllDatasets();
    res.json(datasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

// 上传数据集
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 确保文件已经被保存
    const fileExists = await fs.access(req.file.path)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    const dataset = await datasetService.createDataset({
      name: req.body.name,
      type: 'text',
      path: req.file.path,
      size: req.file.size,
      description: req.body.description,
      userId: req.body.userId,
      userEmail: req.body.userEmail,
      category: req.body.category,
      subCategory: req.body.subCategory,
      status: 'completed',
      visibility: 'public'
    });

    res.status(200).json({
      id: dataset.id,
      fileUrl: `/datasets/${dataset.id}`,
      message: 'Dataset uploaded successfully'
    });
  } catch (error) {
    // 如果上传失败，清理已上传的文件
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload dataset' });
  }
});

// 下载数据集
router.get('/download/:id', async (req: Request, res: Response) => {
  try {
    const dataset = await datasetService.getDataset(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const filePath = dataset.path;
    if (!await fs.access(filePath).then(() => true).catch(() => false)) {
      return res.status(404).json({ error: 'File not found' });
    }

    await datasetService.updateDownloads(dataset.id);
    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download dataset' });
  }
});

export default router;