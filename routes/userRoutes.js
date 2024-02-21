import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/update', upload.single('profilePicture'), UserController.updateUser);

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

router.delete('/:userId', UserController.deleteUser);

export default router;