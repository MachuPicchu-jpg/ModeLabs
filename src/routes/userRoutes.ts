// routes/userRoutes.ts
import express from 'express';
import userController from '../controller/UserController';

const router = express.Router();

router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;
