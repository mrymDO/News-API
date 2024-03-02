import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/user.js';
import { generateAccessToken } from '../utils/jwt.js';

const { expect } = chai;
chai.use(chaiHttp);

// Mock user object for testing
const mockUser = {
  username: 'uniqueusername',
  email: 'testuser@example.com',
  password: 'password123',
  role: 'user',
  generateAccessToken: function () {
    // Mock implementation of generateAccessToken
    return 'mockedAccessToken';
  },
};

describe('UserController', () => {
  let adminUser, regularUser;

  before(async () => {
    console.log('Before deletion:', await User.find({ username: mockUser.username }));
    await User.deleteMany({ username: mockUser.username });
    console.log('After deletion:', await User.find({ username: mockUser.username }));

    // Create mock users in the database for testing
    adminUser = await User.create({ ...mockUser, role: 'admin' });
    regularUser = await User.create(mockUser);
  });

  describe('PUT /user/update', () => {
    it('should update user details', async () => {
      const updatedUserData = {
        username: 'newusername',
        email: 'newemail@example.com',
        password: 'newpassword',
      };

      const res = await chai.request(app)
        .put('/user/update')
        .set('Authorization', `Bearer ${generateAccessToken(regularUser._id)}`)
        .send(updatedUserData);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ message: 'User updated successfully', username: 'newusername' });
    });
  });

  describe('DELETE /user/delete/:id', () => {
    it('should delete a user by ID', async () => {
      const res = await chai.request(app)
        .delete(`/user/delete/${regularUser._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(adminUser._id)}`);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ message: 'User deleted successfully' });
    });
  });

  describe('GET /user/all', () => {
    it('should get all users', async () => {
      const res = await chai.request(app)
        .get('/user/all')
        .set('Authorization', `Bearer ${generateAccessToken(adminUser._id)}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /user/:userId', () => {
    it('should get a user by ID', async () => {
      const res = await chai.request(app)
        .get(`/user/${regularUser._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(adminUser._id)}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
    });
  });
});
