import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to users
 */

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update a user
 *     description: Update user details. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User data
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               role:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 */

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user
 *     description: Delete a user by ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete user
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     description: Retrieve a list of all users. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID
 *     description: Retrieve a user by its ID. Requires Bearer token for authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     tags: [User]
 *     summary: Get user profile by ID
 *     description: Retrieve a user's profile by its ID. Requires Bearer token for authentication.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */
router.get('/profile/:userId', UserController.getUserProfile);

router.use(authenticateToken);

router.put('/update/:id', upload.single('profilePicture'), UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser)

router.get('/all', (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  UserController.getAllUsers(req, res);
});

router.get('/:userId', (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  UserController.getUserById(req, res);
});

export default router;