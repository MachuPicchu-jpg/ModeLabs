import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { initializeEvaluationSystem } from './services/evaluationService';
import * as dotenv from 'dotenv';
import './config/firebase'; // This will initialize Firebase

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Prisma
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Import and use routes
import evaluationRoutes from './routes/evaluationRoutes';
app.use('/api/evaluation', evaluationRoutes);

// Start the server and initialize evaluation system
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    console.log('Initializing evaluation system...');
    await initializeEvaluationSystem();
    console.log('Evaluation system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize evaluation system:', error);
  }
});

export default app; 