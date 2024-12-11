import express from 'express';
import { getLanguageModelLeaderboard, getMultimodalModelLeaderboard } from '../controllers/rankingController';

const router = express.Router();

// 获取大语言模型排行榜
router.get('/language-models', getLanguageModelLeaderboard);

// 获取多模态模型排行榜
router.get('/multimodal-models', getMultimodalModelLeaderboard);

export default router;
