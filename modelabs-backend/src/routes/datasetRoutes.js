const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer storage
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
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.json', '.jsonl', '.csv', '.xlsx', '.yaml', '.yml', '.tsv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create upload directory
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'uploads/datasets');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// Ensure directory exists before routes
ensureUploadDir();

// Get all datasets
router.get('/', async (req, res) => {
  try {
    const datasets = await prisma.dataset.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        description: true,
        userId: true,
        userEmail: true,
        category: true,
        subCategory: true,
        downloads: true,
        visibility: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(datasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

// Upload dataset
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Ensure file was saved
    const fileExists = await fs.access(req.file.path)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    // Get file size from the actual file
    const stats = await fs.stat(req.file.path);
    const fileSize = stats.size;

    const dataset = await prisma.dataset.create({
      data: {
        id: uuidv4(),
        name: req.body.name,
        type: req.body.type || 'text',
        path: req.file.path,
        size: fileSize,
        description: req.body.description,
        userId: req.body.userId,
        userEmail: req.body.userEmail,
        category: req.body.category,
        subCategory: req.body.subCategory,
        downloads: 0,
        visibility: req.body.visibility || 'public',
        status: req.body.status || 'completed'
      }
    });

    res.status(200).json({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      size: dataset.size,
      description: dataset.description,
      userId: dataset.userId,
      userEmail: dataset.userEmail,
      category: dataset.category,
      subCategory: dataset.subCategory,
      downloads: dataset.downloads,
      visibility: dataset.visibility,
      status: dataset.status,
      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt,
      message: 'Dataset uploaded successfully'
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload dataset' });
  }
});

// Download dataset
router.get('/download/:id', async (req, res) => {
  try {
    const dataset = await prisma.dataset.findUnique({
      where: { id: req.params.id }
    });
    
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const filePath = dataset.path;
    if (!await fs.access(filePath).then(() => true).catch(() => false)) {
      return res.status(404).json({ error: 'File not found' });
    }

    await prisma.dataset.update({
      where: { id: dataset.id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download dataset' });
  }
});

module.exports = router; 