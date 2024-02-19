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
}

export default new UserController();