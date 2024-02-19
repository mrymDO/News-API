import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

class UserController {
    async registerUser(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, email and password are required' });
            }
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'user already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            if (!newUser) {
                return res.status(500).json({ message: 'Failed to create user' });
            }

            const { password: userPassword, ...userWithoutPassword } = newUser.toObject();

            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword, token });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
}

export default new UserController();