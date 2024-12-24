import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errors';
import datasetRoutes from './routes/datasetRoutes';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

// Load environment variables
config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Routes
app.use('/api/datasets', datasetRoutes);

// Error handling for multer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size is too large. Maximum size is 100MB'
      });
    }
    return res.status(400).json({
      error: err.message
    });
  }
  
  if (err instanceof Error) {
    return res.status(500).json({
      error: err.message
    });
  }
  
  next(err);
});

// General error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

export default app;