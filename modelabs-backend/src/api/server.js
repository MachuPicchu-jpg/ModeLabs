const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); // 导入 PrismaClient
const { evaluateModel } = require('../services/evaluation_service');
const admin = require('firebase-admin');
const datasetRoutes = require('../routes/datasetRoutes');

const app = express();
const port = process.env.PORT || 3001;

// 配置 multer 以保留原始文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });
const prisma = new PrismaClient(); // 初始化 PrismaClient

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dataset routes
app.use('/api/datasets', datasetRoutes);

// 上传图片并返回图片的 URL
app.post('/api/users/uploadphoto', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const photoURL = `http://localhost:3001/uploads/${file.filename}`;
    console.log('Photo URL:', photoURL);
    // 假设您有用户 ID
    const userId = req.body.userId;

    // 检查用户是否存在
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // 如果用户不存在，则创建一个新用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          photoURL
        }
      });
    } else {
      // 更新用户的 photoURL
      user = await prisma.user.update({
        where: { id: userId },
        data: { photoURL }
      });
    }

    res.json({ url: photoURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

console.log('__dirname:', __dirname);

// 提供静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API endpoint to trigger model evaluation
app.post('/api/evaluate', async (req, res) => {
  try {
    const { modelId, modelType } = req.body;

    if (!modelId || !modelType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get model data from Firebase
    const collectionName = modelType === 'Large Language' ? 'language-models' : 'multimodal-models';
    const modelDoc = await admin.firestore().collection(collectionName).doc(modelId).get();

    if (!modelDoc.exists()) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const modelData = {
      ...modelDoc.data(),
      id: modelDoc.id,
      model_type: modelType
    };

    // Start evaluation in background
    evaluateModel(modelData).catch(error => {
      console.error('Error during model evaluation:', error);
    });

    // Return success immediately
    res.json({ message: 'Evaluation started' });
  } catch (error) {
    console.error('Error handling evaluation request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;