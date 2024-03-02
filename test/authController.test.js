import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/user.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Authentication Controller', () => {
  before(async () => {
    await User.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      const res = await chai.request(app)
        .post('/auth/register')
        .send(newUser);

      console.log(res.body);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message').equal('User registered successfully');
      expect(res.body).to.have.property('username').equal(newUser.username);
    });

    it('should return 400 for missing username, email, or password', async () => {
      const incompleteUser = {
        email: 'incomplete@example.com',
        password: 'incompletepassword',
      };

      const res = await chai.request(app)
        .post('/auth/register')
        .send(incompleteUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('Username, email and password are required');
    });

    it('should return 400 for an existing user', async () => {
      const existingUser = {
        username: 'existinguser',
        email: 'existinguser@example.com',
        password: 'existingpassword',
      };

      existingUser.password = await bcrypt.hash(existingUser.password, 10);
      await User.create(existingUser);

      const res = await chai.request(app)
        .post('/auth/register')
        .send(existingUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in an existing user', async () => {
      const existingUser = {
        username: 'existinguser',
        password: 'existingpassword',
      };

      const user = await User.findOne({ username: existingUser.username });

      if (!user) {
        // User doesn't exist, create it
        await User.create({
          ...existingUser,
          email: 'existinguser@example.com',
          password: await bcrypt.hash(existingUser.password, 10),
        });
      }

      const res = await chai.request(app)
        .post('/auth/login')
        .send(existingUser);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').equal('Login successful');
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('username').equal(existingUser.username);
    });

    it('should return 400 for missing username or password', async () => {
      const incompleteUser = {
        username: 'incompleteuser',
      };

      const res = await chai.request(app)
        .post('/auth/login')
        .send(incompleteUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('Username and password are required');
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidUser = {
        username: 'invaliduser',
        password: 'invalidpassword',
      };

      const res = await chai.request(app)
        .post('/auth/login')
        .send(invalidUser);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').equal('Invalid credentials');
    });
  });
});
