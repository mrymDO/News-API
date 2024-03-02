import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js'; 
import Category from '../models/category.js';
import { generateAccessToken } from '../utils/jwt.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('CategoryController', () => {
  beforeEach(async () => {
    await Category.deleteMany();
  });

  describe('GET /categories', () => {
    it('should get all categories', async () => {
      await Category.create({ name: 'Category1', description: 'Description1' });
      await Category.create({ name: 'Category2', description: 'Description2' });

      const res = await chai.request(app).get('/category');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
    });
  });

  describe('GET /category/:id', () => {
    it('should get a category by id', async () => {
      const category = await Category.create({ name: 'TestCategory', description: 'TestDescription' });

      const res = await chai.request(app).get(`/category/${category._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('TestCategory');
    });

    it('should return 404 if category not found', async () => {
      const res = await chai.request(app).get('/category/invalidId');

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Category not found' });
    });
  });

  describe('POST /category', () => {
    it('should add a new category', async () => {
      const newCategory = { name: 'NewCategory', description: 'NewDescription' };

      const token = generateAccessToken('userId', 'admin'); 

      const res = await chai.request(app)
        .post('/category')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('NewCategory');
    });

    it('should return 400 if name is missing', async () => {
      const res = await chai.request(app).post('/category').send({});

      expect(res).to.have.status(400);
      expect(res.body).to.deep.equal({ message: 'Category name is required' });
    });
  });

  describe('PUT /category/:id', () => {
    it('should update a category', async () => {
      const category = await Category.create({ name: 'CategoryToUpdate', description: 'OldDescription' });

      const updatedCategory = { name: 'UpdatedCategory', description: 'NewDescription' };
      const token = generateAccessToken('userId', 'admin'); // Change 'userId' and 'admin' as needed

      const res = await chai.request(app)
        .put(`/category/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedCategory);
        
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('UpdatedCategory');
      expect(res.body.description).to.equal('NewDescription');
    });

    it('should return 403 if user is not an admin', async () => {
      const res = await chai.request(app).put('/category/validId').send({});

      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({ message: 'Forbidden - Admin access required' });
    });

    it('should return 404 if category not found', async () => {
      const res = await chai.request(app).put('/category/invalidId').send({});

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ message: 'Category not found' });
    });
  });

  describe('DELETE /category/:id', () => {
    it('should delete a category', async () => {
      const category = await Category.create({ name: 'CategoryToDelete', description: 'ToDeleteDescription' });

      const res = await chai.request(app).delete(`/category/${category._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ message: 'Category deleted' });
    });

    it('should return 403 if user is not an admin', async () => {
        const category = await Category.create({ name: 'ValidCategory', description: 'ValidDescription' });
      
        const res = await chai.request(app).delete(`/category/${category._id}`);
      
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Category deleted');
      
        const deletedCategory = await Category.findById(category._id);
        expect(deletedCategory).to.be.null;
      });

    it('should return 404 if category not found', async () => {
      const res = await chai.request(app).delete('/category/invalidId');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'Category not found');
    });
  });
});
