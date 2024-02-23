import Article from '../models/article.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import upload from '../config/multerConfig.js';
import fs from 'fs';
import mongoose from 'mongoose';

class ArticleController {
  async get(req, res) {
    const { id } = req.params

    const article = await Article.findById(id)

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    return res.status(200).json({ article })
  }

  async getAll(req, res) {
    const articles = await Article.find().sort({ createdAt: 'desc' });;
    return res.status(200).json(articles);
  }

  async add(req, res) {
    const { userId } = req;
    const { title, content, category } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const uploadImage = upload.single('image');
  
    uploadImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image" });
      }
  
      let categoryObject = null;
  
      if (category) {
        categoryObject = await Category.findOne({ name: category }).exec();
  
        if (!categoryObject) {
          categoryObject = await Category.findById(category).exec();
          if (!categoryObject) {
            return res.status(400).json({ message: "Invalid category name provided" });
          }
        }
      }
  
      const newArticle = await Article.create({
        title,
        content,
        image: req.file ? req.file.path : "",
        author: userId,
        category: categoryObject ? categoryObject._id : null,
      });
  
      
      return res.status(201).json(newArticle);
    });
  }

  async update(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { title, content, category } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
  
    const user = await User.findById(userId);
    const article = await Article.findById(id);
  
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
  
    let newCategoryId = article.category;
  
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        newCategoryId = mongoose.Types.ObjectId(category);
      } else {
        const validCategory = await Category.findOne({ name: category });
  
        if (!validCategory) {
          return res.status(400).json({ message: "Invalid category name provided" });
        }
  
        newCategoryId = validCategory._id;
      }
    }
  
    const uploadImage = upload.single('image');
  
    if (user.role === 'admin' || userId === article.author.toString()) {
      uploadImage(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: "Error uploading image" });
        }
  
        if (req.file && article.image) {
          fs.unlinkSync(article.image);
          console.log(`Existing image deleted: ${article.image}`);
        }
  
        article.title = title || article.title;
        article.image = req.file ? req.file.path : (article.image || "");
        article.content = content || article.content;
        article.category = newCategoryId;
        article.updatedAt = Date.now();
  
        await article.save();
  
        return res.status(200).json(article);
      });
    } else {
      return res.status(403).json({ message: "Permission denied" });
    }
  }
  
  async getByCategory(req, res) {
    const { categoryId } = req.params;
    const articles = await Article.find({ category: categoryId });
    return res.status(200).json(articles);
  }

  async getByUser(req, res) {
    const { userId } = req.params;
    const articles = await Article.find({ author: userId });
    return res.status(200).json(articles);
  }

  async delete(req, res) {
    const { userId } = req
    const { id } = req.params
    const user = await User.findById(userId);
    const article = await Article.findById(id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }
    if (user.role == 'admin' || userId == article.author) {
      await Article.deleteOne({ _id: id });
      return res.status(200).json({ message: "Article deleted" })
    }

    return res.status(400).json({ messgae: "cannot delete article" })
  }

  async search(req, res) {
    const { user, category, title, content } = req.query;
    const searchQuery = {};

    if (user) searchQuery.author = user;
    if (category) searchQuery.category = category;
    if (title) searchQuery.title = { $regex: title, $options: 'i' };
    if (content) searchQuery.content = { $regex: content, $options: 'i' };

    const articles = await Article.find(searchQuery);
    return res.status(200).json(articles);
  }
}


export default new ArticleController()