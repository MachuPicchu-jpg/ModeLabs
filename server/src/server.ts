import app from './app';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
config();

const port = process.env.PORT || 3001;

// Ensure upload directory exists
async function ensureUploadDirectory() {
  const uploadDir = path.join(process.cwd(), 'uploads/datasets');
  try {
    await fs.access(uploadDir);
    console.log('Upload directory exists:', uploadDir);
  } catch {
    console.log('Creating upload directory:', uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// Start server
async function startServer() {
  try {
    await ensureUploadDirectory();
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 