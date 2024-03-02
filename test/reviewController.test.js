import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/user.js';
import Article from '../models/article.js';
import Review from '../models/review.js';
import { generateAccessToken } from '../utils/jwt.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('ReviewController', () => {
  let user, article, review;

  beforeEach(async () => {
    await Review.deleteMany();
    await Article.deleteMany();
    await User.deleteMany();

    user = await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    });

    article = await Article.create({
      title: 'Test Article',
      content: 'This is a test article.',
      author: user._id,
    });

    review = await Review.create({
      user: user._id,
      article: article._id,
      content: 'Great article!',
    });
  });

  describe('POST /review', () => {
    it('should create a new review', async () => {
      const newReviewData = {
        userId: user._id,
        articleId: article._id,
        content: 'Excellent content!',
      };

      const res = await chai.request(app)
        .post('/review')
        .send(newReviewData);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.user.toString()).to.equal(user._id.toString());
      expect(res.body.article.toString()).to.equal(article._id.toString());
      expect(res.body.content).to.equal('Excellent content!');
    });

    it('should return 404 for non-existing article', async () => {
      const nonExistingArticleData = {
        userId: user._id,
        articleId: mongoose.Types.ObjectId(),
        content: 'Good read!',
      };

      const res = await chai.request(app)
        .post('/review')
        .send(nonExistingArticleData);

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Article not found' });
    });

    it('should return 400 if user has already reviewed the article', async () => {
      const duplicateReviewData = {
        userId: user._id,
        articleId: article._id,
        content: 'Duplicate review!',
      };

      const res = await chai.request(app)
        .post('/review')
        .send(duplicateReviewData);

      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({ message: 'User has already reviewed this article' });
    });
  });

  describe('GET /review/:id', () => {
    it('should get a review by id', async () => {
      const res = await chai.request(app)
        .get(`/review/${review._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body._id.toString()).to.equal(review._id.toString());
      expect(res.body.user.toString()).to.equal(user._id.toString());
      expect(res.body.article.toString()).to.equal(article._id.toString());
      expect(res.body.content).to.equal('Great article!');
    });

    it('should return 404 if review is not found', async () => {
      const invalidReviewId = mongoose.Types.ObjectId();

      const res = await chai.request(app)
        .get(`/review/${invalidReviewId}`);

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Review not found' });
    });
  });

  describe('GET /review', () => {
    it('should get all reviews', async () => {
      const res = await chai.request(app)
        .get('/review');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]._id.toString()).to.equal(review._id.toString());
      expect(res.body[0].user.toString()).to.equal(user._id.toString());
      expect(res.body[0].article.toString()).to.equal(article._id.toString());
      expect(res.body[0].content).to.equal('Great article!');
    });
  });

  describe('PUT /review/:id', () => {
    it('should update a review', async () => {
      const updatedReviewData = {
        content: 'Updated content!',
      };

      const res = await chai.request(app)
        .put(`/review/${review._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(user._id, 'user')}`)
        .send(updatedReviewData);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body._id.toString()).to.equal(review._id.toString());
      expect(res.body.user.toString()).to.equal(user._id.toString());
      expect(res.body.article.toString()).to.equal(article._id.toString());
      expect(res.body.content).to.equal('Updated content!');
    });

    it('should return 403 if the user is not the owner of the review', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'otheruser@example.com',
        password: 'password456',
      });

      const res = await chai.request(app)
        .put(`/review/${review._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(otherUser._id, 'user')}`)
        .send({ content: 'Attempted update!' });

      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({ message: 'Permission denied' });
    });

    it('should return 404 if the review is not found', async () => {
      const invalidReviewId = mongoose.Types.ObjectId();

      const res = await chai.request(app)
        .put(`/review/${invalidReviewId}`)
        .set('Authorization', `Bearer ${generateAccessToken(user._id, 'user')}`)
        .send({ content: 'Attempted update!' });

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Review not found' });
    });
  });

  describe('DELETE /review/:id', () => {
    it('should delete a review', async () => {
      const res = await chai.request(app)
        .delete(`/review/${review._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(user._id, 'user')}`);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ message: 'Review deleted' });
    });

    it('should return 403 if the user is not the owner of the review', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'otheruser@example.com',
        password: 'password456',
      });

      const res = await chai.request(app)
        .delete(`/review/${review._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(otherUser._id, 'user')}`);

      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({ message: 'Permission denied' });
    });

    it('should return 404 if the review is not found', async () => {
        const invalidReviewId = mongoose.Types.ObjectId();

      const res = await chai.request(app)
        .delete(`/review/${invalidReviewId}`)
        .set('Authorization', `Bearer ${generateAccessToken(user._id, 'user')}`);

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Review not found' });
    });
  });
});
