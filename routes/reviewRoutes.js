import express from 'express';
import ReviewController from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getById);

router.use(authenticateToken);

router.post('/', authenticateToken, ReviewController.create);
router.put('/:id', authenticateToken, ReviewController.update);
router.delete('/:id', authenticateToken, ReviewController.delete);

export default router;