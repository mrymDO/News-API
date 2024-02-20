import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateAccessToken } from '../utils/jwt.js';

class UserController {
  async registerUser(req, res) {
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

    const token = generateAccessToken(newUser._id)
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword, token });

  }

  async loginUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAccessToken(user._id)
    res.status(200).json({ message: 'Login successful', user, token });

  }
}

export default new UserController();
