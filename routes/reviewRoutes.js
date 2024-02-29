import express from 'express';
import ReviewController from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Operations related to reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Review]
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews.
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     tags: [Review]
 *     summary: Create a new review
 *     description: Create a new review. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Review data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - articleId
 *               - content
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Article not found or User has already reviewed this article
 */  
 /**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Review]
 *     summary: Get a review by ID
 *     description: Retrieve a review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Review not found
 *   put:
 *     tags: [Review]
 *     summary: Update a review by ID
 *     description: Update a review by its ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Review data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Review]
 *     summary: Delete a review by ID
 *     description: Delete a review by its ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Review not found
 */

router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getById);

router.use(authenticateToken);

router.post('/', authenticateToken, ReviewController.create);
router.put('/:id', authenticateToken, ReviewController.update);
router.delete('/:id', authenticateToken, ReviewController.delete);

export default router;