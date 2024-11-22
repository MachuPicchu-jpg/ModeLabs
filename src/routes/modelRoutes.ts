import { Router } from 'express';
import * as modelController from '../controllers/modelController';

const router = Router();

router.get('/', modelController.getModels);
router.get('/:id', modelController.getModel);
router.post('/', modelController.createModel);
router.put('/:id', modelController.updateModel);

export default router;