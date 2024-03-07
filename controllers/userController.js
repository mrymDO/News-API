import bcrypt from 'bcrypt';
import User from '../models/user.js';
import Article from '../models/article.js';
import fs from "fs";

class UserController {
  async updateUser(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { username, email, password, bio, role } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User to update not found' });
    }

    if (user.role !== 'admin' && userId !== id) {
      return res.status(403).json({ message: 'Forbidden - You are not allowed to update this user' });
    }

    if (username) userToUpdate.username = username;
    if (email) userToUpdate.email = email;
    if (password) userToUpdate.password = await bcrypt.hash(password, 10);
    if (bio) userToUpdate.bio = bio;
    if (req.file) {
      if (userToUpdate.profilePicture) {
        fs.unlinkSync(userToUpdate.profilePicture)
      }
      userToUpdate.profilePicture = req.file.path;
    }
    if (user.role === 'admin' && (role === 'admin' || role === 'user')) {
      userToUpdate.role = role
    }
    await userToUpdate.save();

    res.status(200).json({ message: 'User updated successfully', username: user.username });
  }

  async deleteUser(req, res) {
    const { userId } = req
    const { id } = req.params
    const user = await User.findById(userId);
    const currentUser = await User.findById(id);
    if (!currentUser || !user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role == 'admin' || (user.role === 'user' && userId === id)) {
      const { profilePicture } = currentUser

      if (profilePicture) {
        fs.unlinkSync(profilePicture)
      }
      await User.deleteOne({ _id: id })
      return res.status(200).json({ message: 'User deleted successfully' });
    }
    res.status(400).json({ message: 'cannot delete user' });
  }

  async getAllUsers(req, res) {
    const users = await User.find({}, '-password');
    res.status(200).json({
      count: users.length,
      users
    });
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

  async getUserProfile(req, res) {
    const userId = req.params.userId;
    const user = await User.findById(userId, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userArticles = await Article.find({ author: userId });
    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      articles: userArticles,
    });
  }
}

export default new UserController();