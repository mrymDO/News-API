import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);

router.use(authenticateToken);

router.post('/', CategoryController.add);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;