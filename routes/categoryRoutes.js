import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operations related to categories
 */

/**
 * @swagger
 * /category:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     responses:
 *       200:
 *         description: Successful response
 *
 *   post:
 *     tags: [Category]
 *     summary: Add a new category
 *     description: Add a new category. Requires admin access.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Category data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Category name is required
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     tags: [Category]
 *     summary: Get a category by ID
 *     description: Retrieve a category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Category ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Category not found
 *
 *   put:
 *     tags: [Category]
 *     summary: Update a category by ID
 *     description: Update a category by its ID. Requires admin access.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Category ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Category data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     tags: [Category]
 *     summary: Delete a category by ID
 *     description: Delete a category by its ID. Requires admin access.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Category ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */
router.get('/', CategoryController.getAll);
router.post('/', authenticateToken, CategoryController.add);
router.get('/:id', CategoryController.getById);
router.put('/:id', authenticateToken, CategoryController.update);
router.delete('/:id', authenticateToken, CategoryController.delete);

export default router;
