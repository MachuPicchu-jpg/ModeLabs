import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import rankingRoutes from './routes/rankingRoutes';
import routes from './routes';
import { errorHandler } from './middlewares/errors';
import datasetRoutes from './routes/datasetRoutes';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { evaluationRoutes } from './routes/evaluationRoutes';
import { initializeEvaluationSystem } from './services/evaluationService';

// Load environment variables
config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/api', rankingRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/evaluation', evaluationRoutes);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling for multer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
  next(err);
});

// General error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Initialize evaluation system when server starts
console.log('Initializing evaluation system...');
initializeEvaluationSystem().catch(error => {
  console.error('Error initializing evaluation system:', error);
});

export default app;