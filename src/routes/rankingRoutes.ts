import { Router } from 'express';
import * as rankingController from '../controllers/rankingController';

const router = Router();

router.get('/language-model-rankings', rankingController.getLanguageModelRankings);
router.get('/multimodal-model-rankings', rankingController.getMultimodalModelRankings);
router.get('/language-model-rankings/:id', rankingController.getLanguageModelRanking);
router.get('/multimodal-model-rankings/:id', rankingController.getMultimodalModelRanking);
router.post('/language-model-rankings', rankingController.createLanguageModelRanking);
router.post('/multimodal-model-rankings', rankingController.createMultimodalModelRanking);
router.put('/language-model-rankings/:id', rankingController.updateLanguageModelRanking);
router.put('/multimodal-model-rankings/:id', rankingController.updateMultimodalModelRanking);

export default router;