import express from 'express';
import LikeController from '../controllers/LikeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', LikeController.getAll);

router.use(authenticateToken);

router.post('/', LikeController.create);
router.delete('/:id', LikeController.delete);

export default router;