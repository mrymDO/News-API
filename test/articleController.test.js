process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import Article from '../models/article.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('ArticleController', () => {
  before(async function (done) {
    // Connect to a test database before running the tests
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            return done(disconnectError);
        }
    }

    mongoose.connect('mongodb://127.0.0.1:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (connectError) => {
        done(connectError);
    });
});

after(async function () {
    // Close the mongoose connection after all tests are done
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
});

  // Test cases for the add method
  describe('POST /article', () => {
    it('should add a new article', async () => {
      const response = await chai.request(app)
        .post('/article')
        .send({
          title: 'Test Article',
          content: 'Test Content',
          userId: mongoose.Types.ObjectId(),
        });

      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('title', 'Test Article');
      expect(response.body).to.have.property('content', 'Test Content');
    });

    it('should return 400 if title or content is missing', async () => {
      const response = await chai.request(app)
        .post('/article')
        .send({
          content: 'Test Content',
          userId: mongoose.Types.ObjectId(),
        });

      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message', 'Title and content are required');
    });
  });

  // Test cases for the update method
  describe('PUT /article/:id', () => {
    it('should update an article', async () => {
      const article = await Article.create({
        title: 'Old Title',
        content: 'Old Content',
        author: mongoose.Types.ObjectId(),
      });

      const response = await chai.request(app)
        .put(`/article/${article._id}`)
        .send({
          title: 'New Title',
          content: 'New Content',
        });

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('title', 'New Title');
      expect(response.body).to.have.property('content', 'New Content');
    });

    it('should return 400 if no fields to update', async () => {
      const article = await Article.create({
        title: 'Old Title',
        content: 'Old Content',
        author: mongoose.Types.ObjectId(),
      });

      const response = await chai.request(app)
        .put(`/article/${article._id}`)
        .send({});

      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message', 'No fields to update');
    });
  });

  // Test cases for the get method
  describe('GET /article/:id', () => {
    it('should get an article by ID', async () => {
      const article = await Article.create({
        title: 'Test Article',
        content: 'Test Content',
        author: mongoose.Types.ObjectId(),
      });

      const response = await chai.request(app)
        .get(`/article/${article._id}`);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('title', 'Test Article');
      expect(response.body).to.have.property('content', 'Test Content');
    });

    it('should return 404 if article ID is not found', async () => {
      const response = await chai.request(app)
        .get('/article/nonexistentid');

      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message', 'Article not found');
    });

   
  });

  // Test cases for the getAll method
  describe('GET /article', () => {
    it('should get all articles', async () => {
      await Article.create({ title: 'Article 1', content: 'Content 1', author: mongoose.Types.ObjectId() });
      await Article.create({ title: 'Article 2', content: 'Content 2', author: mongoose.Types.ObjectId() });

      const response = await chai.request(app)
        .get('/article');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf.at.least(2);
    });

    it('should filter articles based on query parameters', async () => {
      await Article.create({ title: 'Tech Article', content: 'Tech Content', author: mongoose.Types.ObjectId() });
      await Article.create({ title: 'Science Article', content: 'Science Content', author: mongoose.Types.ObjectId() });

      const response = await chai.request(app)
        .get('/article?title=Tech');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(1);
      expect(response.body[0]).to.have.property('title', 'Tech Article');
    });
  });

  // Test cases for the delete method
  describe('DELETE /article/:id', () => {
    it('should delete an article by ID', async () => {
      const article = await Article.create({
        title: 'Article to Delete',
        content: 'Content to Delete',
        author: mongoose.Types.ObjectId(),
      });

      const response = await chai.request(app)
        .delete(`/article/${article._id}`);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message', 'Article deleted');
    });

    it('should return 404 if article ID is not found', async () => {
      const response = await chai.request(app)
        .delete('/article/nonexistentid');

      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message', 'Article not found');
    });

   
  });
});
