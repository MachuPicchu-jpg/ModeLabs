import { Router } from 'express';
import * as evaluationController from '../controllers/evaluationController';

const router = Router();

router.post('/', evaluationController.createTask);
router.get('/', evaluationController.getTasks);
router.get('/:id', evaluationController.getTask);
router.get('/:id/result', evaluationController.getResult);
router.post('/:id/cancel', evaluationController.cancelTask);

export default router;