import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/update', upload.single('profilePicture'), UserController.updateUser);

export default router;