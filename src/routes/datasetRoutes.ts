import { Router } from 'express';
import * as datasetController from '../controllers/datasetController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', datasetController.getDatasets);
router.get('/:id', datasetController.getDataset);
router.post('/upload', upload.single('file'), datasetController.uploadDataset);
router.delete('/:id', datasetController.deleteDataset);

export default router;