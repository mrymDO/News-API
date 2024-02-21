import bcrypt from 'bcrypt';
import User from '../models/user.js';
import fs from "fs"

class UserController {
  async updateUser(req, res) {
    const { userId } = req;
    const { username, email, password, bio, role } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (bio) user.bio = bio;
    if (req.file) {
      if (user.profilePicture) {
        fs.unlinkSync(profilePicture)
      }
      user.profilePicture = req.file.path;
    }
    if (user.role == 'admin' && (role == 'admin' || role == 'user')) {
      user.role = role
    }
    await user.save();

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
}

export default new UserController();