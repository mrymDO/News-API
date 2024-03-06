import express from "express";
import ArticleController from '../controllers/articleController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from "../config/multerConfig.js";

// Create an Express Router
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Article
 *   description: Operations related to articles
 */

/**
 * @swagger
 * /article:
 *   get:
 *     tags: [Article]
 *     summary: Get all articles
 *     description: Retrieve a list of all articles.
 *     parameters:
 *       - name: userID
 *         in: query
 *         type: string
 *         description: Filter articles by user.
 *       - name: categoryID
 *         in: query
 *         type: string
 *         description: Filter articles by category.
 *       - name: title
 *         in: query
 *         type: string
 *         description: Search articles by title (case-insensitive regex).
 *       - name: content
 *         in: query
 *         type: string
 *       - name: page
 *         in: query
 *         type: integer
 *         minimum: 1
 *       - name: limit
 *         in: query
 *         type: integer
 *         minimum: 1
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     tags: [Article]
 *     summary: Add a new article
 *     description: Add a new article. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Article data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               url:
 *                 type : string
 *             required:
 *               - title
 *               - content
 *               - url
 *     responses:
 *       201:
 *         description: Successfully created
 */
/**
 * @swagger
 * /article/{id}:
 *   get:
 *     tags: [Article]
 *     summary: Get an article by ID
 *     description: Retrieve an article by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Article ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *   put:
 *     tags: [Article]
 *     summary: Update an article by ID
 *     description: Update an article by its ID. Requires Bearer token for authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Article ID
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Article data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Permission denied
 *   delete:
 *     tags: [Article]
 *     summary: Delete an article by ID
 *     description: Delete an article by its ID. Requires Bearer token for authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Article ID
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Permission denied
 */

// Define routes using the Express Router
router.get('/', ArticleController.getAll);
router.post('/', upload.any(), authenticateToken, ArticleController.add);
router.get('/:id', ArticleController.get);
router.delete('/:id', authenticateToken, ArticleController.delete);
router.put('/:id', upload.any(), authenticateToken, ArticleController.update);

export default router;
