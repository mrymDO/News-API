import Article from '../models/article.js';
import User from '../models/user.js';
import Category from '../models/category.js';
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
    const { user, category, title, content } = req.query;
    const searchQuery = {};

    if (user) searchQuery.author = user;
    if (category) searchQuery.category = category;
    if (title) searchQuery.title = { $regex: title, $options: 'i' };
    if (content) searchQuery.content = { $regex: content, $options: 'i' };

    const articles = await Article.find(searchQuery);
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
    let categoryObject = null
    if (category) {
      categoryObject = await Category.findOne({ name: category });

      if (!categoryObject) {
        categoryObject = await Category.findById(category);
        if (!categoryObject) {
          return res.status(400).json({ message: "Invalid category name provided" });
        }
      }
    }
    const file = req.files[0]
    if (!file) {
      return res.status(400).json({ message: "Image not found" })
    }
    const newArticle = await Article.create({
      title,
      content,
      image: file.path,
      author: userId,
      category: categoryObject._id
    });
    return res.status(201).json(newArticle);
  }

  async update(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { title, content, category } = req.body;

    if (!title && !content && !category && !req.file) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await User.findById(userId);
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    let updateFields = {};

    if (title) {
      updateFields.title = title;
    }

    if (content) {
      updateFields.content = content;
    }

    if (category) {
      let newCategoryId = article.category;

      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryObject = await Category.findById(category);
        if (!categoryObject) {
          return res.status(400).json({ message: "Invalid category name provided" });
        }
        newCategoryId = mongoose.Types.ObjectId(category);
      } else {
        const validCategory = await Category.findOne({ name: category });

        if (!validCategory) {
          return res.status(400).json({ message: "Invalid category name provided" });
        }

        newCategoryId = validCategory._id;
      }

      updateFields.category = newCategoryId;
    }

    const file = req.files[0];

    if (user.role === 'admin' || userId === article.author.toString()) {
      if (!file) {
        return res.status(400).json({ message: "Error uploading image" });
      } else {
        if (article.image) {
          fs.unlinkSync(article.image);
          console.log(`Existing image deleted: ${article.image}`);
        }

        updateFields.image = file.path;
      }
      updateFields.updatedAt = Date.now();
      const updatedArticle = await Article.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      const responseArticle = {
        ...updatedArticle.toObject(),
        author: userId,
        category: category ? category.name : null,
      };

      return res.status(200).json(responseArticle);
    } else {
      return res.status(403).json({ message: "Permission denied" });
    }
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
      if (article.image) {
        fs.unlinkSync(article.image);
      }
      await Article.deleteOne({ _id: id });
      return res.status(200).json({ message: "Article deleted" })
    }

    return res.status(400).json({ messgae: "cannot delete article" })
  }

}


export default new ArticleController()