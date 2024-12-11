import { Router } from 'express';
import modelRoutes from './modelRoutes';
import evaluationRoutes from './evaluationRoutes';
import datasetRoutes from './datasetRoutes';
import rankingRoutes from './rankingRoutes';

const router = Router();

router.use('/models', modelRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/datasets', datasetRoutes);
router.use('/rankings', rankingRoutes);

export default router;