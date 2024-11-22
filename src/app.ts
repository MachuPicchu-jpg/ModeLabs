import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errors';

// Load environment variables
config();

const app = express();

// CORS配置
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js 默认端口是3000
    credentials: true
  }));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error'
    });
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;