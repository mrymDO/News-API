import express from 'express';
import LikeController from '../controllers/likeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: Operations related to likes
 */

/**
 * @swagger
 * /likes:
 *   get:
 *     tags: [Like]
 *     summary: Get all likes
 *     description: Retrieve a list of all likes.
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     tags: [Like]
 *     summary: Create a new like
 *     description: Create a new like. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Like data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *               type:
 *                 type: string
 *             required:
 *               - articleId
 *               - type
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid like type
 *       404:
 *         description: User or Article not found
 */
/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     tags: [Like]
 *     summary: Delete a like by ID
 *     description: Delete a like by its ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Like ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Like not found
 *   put:
 *     tags: [Like]
 *     summary: Update a like by ID
 *     description: Update a like by its ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Like ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Like data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *             required:
 *               - type
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid like type
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Like not found
 */

router.get('/', LikeController.getAll);
router.post('/', authenticateToken, LikeController.create);
router.delete('/:id', authenticateToken, LikeController.delete);
router.put('/:id', authenticateToken, LikeController.update);

export default router;
