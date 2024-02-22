import express from "express";
import ArticleController from '../controllers/articleController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.get);

router.use(authenticateToken);

router.get('/:categoryId', ArticleController.getByCategory);
router.get('/:userId', ArticleController.getByUser);
router.get('/search', ArticleController.search);

router.post('/', ArticleController.add);
router.delete('/:id', ArticleController.delete);
router.put('/:id', ArticleController.update);

export default router;