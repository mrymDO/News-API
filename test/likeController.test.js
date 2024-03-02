import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import Like from '../models/like.js';
import Article from '../models/article.js';
import User from '../models/user.js';
import { generateAccessToken } from '../utils/jwt.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('LikeController', () => {
  let user1, user2, article1, like1;

  beforeEach(async () => {
    await Like.deleteMany();
    await Article.deleteMany();
    await User.deleteMany();

    user1 = await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    });

    user2 = await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password456',
    });

    article1 = await Article.create({
      title: 'Test Article',
      content: 'This is a test article.',
      author: user1._id,
    });
  });

  describe('POST /like', () => {
    it('should create a new like', async () => {
      const likeData = {
        userId: user1._id,
        articleId: article1._id,
        type: 'upvote',
      };

      const res = await chai.request(app)
        .post('/like')
        .send(likeData);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.user.toString()).to.equal(user1._id.toString());
      expect(res.body.article.toString()).to.equal(article1._id.toString());
      expect(res.body.type).to.equal('upvote');
    });

    it('should return 400 for invalid like type', async () => {
      const invalidLikeData = {
        userId: user1._id,
        articleId: article1._id,
        type: 'invalidType',
      };

      const res = await chai.request(app)
        .post('/like')
        .send(invalidLikeData);

      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({ message: 'Invalid like type' });
    });

    it('should return 404 for non-existing user or article', async () => {
      const nonExistingUserData = {
        userId: mongoose.Types.ObjectId(),
        articleId: article1._id,
        type: 'upvote',
      };

      const resUser = await chai.request(app)
        .post('/like')
        .send(nonExistingUserData);

      expect(resUser).to.have.status(404);
      expect(resUser.body).to.deep.equal({ message: 'User or Article not found' });

      const nonExistingArticleData = {
        userId: user1._id,
        articleId: mongoose.Types.ObjectId(),
        type: 'upvote',
      };

      const resArticle = await chai.request(app)
        .post('/like')
        .send(nonExistingArticleData);

      expect(resArticle).to.have.status(404);
      expect(resArticle.body).to.deep.equal({ message: 'User or Article not found' });
    });

    it('should return 400 if user already liked or disliked the article', async () => {
      // Create a like for user1 and article1
      await Like.create({
        user: user1._id,
        article: article1._id,
        type: 'upvote',
      });

      const duplicateLikeData = {
        userId: user1._id,
        articleId: article1._id,
        type: 'upvote',
      };

      const res = await chai.request(app)
        .post('/like')
        .send(duplicateLikeData);

      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({ message: 'You have already liked or disliked this article' });
    });
  });

  describe('DELETE /like/:id', () => {
    beforeEach(async () => {
      // Create a like for testing deletion
      like1 = await Like.create({
        user: user1._id,
        article: article1._id,
        type: 'upvote',
      });
    });

    it('should delete a like', async () => {
      const res = await chai.request(app)
        .delete(`/like/${like1._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(user1._id, 'user')}`);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ message: 'Like deleted' });
    });

    it('should return 403 if the user is not the owner of the like', async () => {
      const res = await chai.request(app)
        .delete(`/like/${like1._id}`)
        .set('Authorization', `Bearer ${generateAccessToken(user2._id, 'user')}`);

      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({ message: 'Permission denied' });
    });

    it('should return 404 if the like is not found', async () => {
      const res = await chai.request(app)
        .delete('/like/nonExistingLikeId')
        .set('Authorization', `Bearer ${generateAccessToken(user1._id, 'user')}`);

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Like not found' });
    });
  });

  describe('GET /like', () => {
    it('should get all likes', async () => {
      // Create additional likes for testing
      await Like.create({
        user: user1._id,
        article: article1._id,
        type: 'upvote',
      });

      await Like.create({
        user: user2._id,
        article: article1._id,
        type: 'downvote',
      });

      const res = await chai.request(app)
        .get('/like');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
    });
  });
});
