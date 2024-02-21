import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { generateAccessToken } from '../utils/jwt.js';

class UserController {
    async updateUser(req, res) {
        const { userId } = req;
        const { username, email, password, bio } = req.body;
        const user = await User.findById(userId);

        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (bio) user.bio = bio;
        if (req.file) user.profilePicture = req.file.path;

        await user.save();

        console.log('UserID:', userId);
        console.log('Request Body:', req.body);

        const token = generateAccessToken(user._id);

        res.status(200).json({ message: 'User updated successfully', username: user.username, token });
    }

    async getAllUsers(req, res) {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    }

    async getUserById(req, res) {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }
        const userId = req.params.userId;
        const userById = await User.findById(userId, '-password');
        if (!userById) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userById);
    }

    async deleteUser(req, res) {
        const { userId } = req;
        const targetUserId = req.params.userId;

        if (req.userRole === 'admin' || userId === targetUserId) {
            const deletedUser = await User.findByIdAndDelete(targetUserId);
            
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        }
    }
}

export default new UserController();