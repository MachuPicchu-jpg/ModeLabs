import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import rankingRoutes from './routes/rankingRoutes';
import routes from './routes';
import { errorHandler } from './middlewares/errors';

// Load environment variables
config();


const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js 默认端口是3000
  credentials: true
}));

app.use(express.json());
app.use('/api', rankingRoutes); // 确保路由前缀与前端请求路径匹配

// CORS配置

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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