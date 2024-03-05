import express from 'express';
import UserController from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations related to authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Register a new user with a unique username and email.
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username, email, and password are required
 *       500:
 *         description: Failed to create user
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     description: Login with a registered username and password.
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid credentials
 */

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
export default router;