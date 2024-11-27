// routes/rankRouter.ts
import { Router } from 'express';
import * as rankController from '../controllers/rankController';

const router = Router();

// 大语言模型排行榜路由
router.post('/language-model-rank', rankController.createLanguageModelRank);
router.get('/language-model-rank', rankController.getLanguageModelRanks);
router.put('/language-model-rank', rankController.updateLanguageModelRank);
router.delete('/language-model-rank/:id', rankController.deleteLanguageModelRank);

// 多模态模型排行榜路由
router.post('/multimodal-model-rank', rankController.createMultimodalModelRank);
router.get('/multimodal-model-rank', rankController.getMultimodalModelRanks);
router.put('/multimodal-model-rank', rankController.updateMultimodalModelRank);
router.delete('/multimodal-model-rank/:id', rankController.deleteMultimodalModelRank);

export default router;
