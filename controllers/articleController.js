import Article from '../models/article.js';
import User from '../models/user.js';
import Review from '../models/review.js';
import Like from '../models/like.js';
import Category from '../models/category.js';
import fs from 'fs';
import mongoose from 'mongoose';
import { fetchReviewsAndLikes } from '../utils/articleUtils.js';


class ArticleController {

  async get(req, res) {
    const { id } = req.params

    const article = await Article.findById(id)

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    const { reviews, likes } = await fetchReviewsAndLikes(id);

    return res.status(200).json({ article: { ...article.toObject(), reviews, likes } });
  }

  async getAll(req, res) {
    const { user, category, title, content, page = 1, limit = 10 } = req.query;
    const searchQuery = {};

    if (user) searchQuery.author = user;
    if (category) searchQuery.category = category;
    if (title) searchQuery.title = { $regex: title, $options: 'i' };
    if (content) searchQuery.content = { $regex: content, $options: 'i' };

    const skip = (page - 1) * limit;
    
    const articles = await Article.find(searchQuery)
         .skip(skip)
         .limit(limit);
    const articlesWithReviewsAndLikes = [];

    for (const article of articles) {
      const { reviews, likes } = await fetchReviewsAndLikes(article._id);
      articlesWithReviewsAndLikes.push({ ...article.toObject(), reviews, likes });
  }

    return res.status(200).json(articlesWithReviewsAndLikes);
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
    const file = req.files ? req.files[0] : null;
    //if (!file) {
      //return res.status(400).json({ message: "Image not found" })
    //}
    const imagePath = file ? file.path : "";
    const newArticle = await Article.create({
      title,
      content,
      image: imagePath,
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

    let categoryObject = null;
    
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

    const files = req.files;
    let imagePath = "";
    let file;
    if (files && files.length > 0) {
      file = files[0];
      imagePath = file.path;
    }

    if (user.role === 'admin' || userId === article.author.toString()) {
      if (imagePath !== "") {
        if (article.image) {
          fs.unlinkSync(article.image);
          console.log(`Existing image deleted: ${article.image}`);
        }

        updateFields.image = imagePath;
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
      console.log('Article not found:', id);
      return res.status(404).json({ message: "Article not found" })
    }
    if (user.role == 'admin' || userId == article.author) {
      const reviews = await Review.find({ article: id });
      console.log('Found reviews:', reviews);
      if (reviews && reviews.length > 0) {
        console.log('Deleting reviews...');
        await Review.deleteMany({ article: id });
      }
      const likes = await Like.find({ article: id });
      console.log('Found likes:', likes);
      if (likes && likes.length > 0) {
        console.log('Deleting likes...');
        await Like.deleteMany({ article: id });
      }
      if (article.image) {
        const imagePath = article.image.replace(/\\/g, '/');
        if (fs.existsSync(imagePath)) {
          console.log('Deleting image...');
          fs.unlinkSync(imagePath);
          console.log('Image deleted successfully.');
        }
      }
      console.log('Deleting article...');
      await Article.deleteOne({ _id: id });
      console.log('Article deleted successfully.');
      return res.status(200).json({ message: "Article deleted" })
    }

    console.log('Permission denied.');
    return res.status(403).json({ message: "Permission denied" })
  }

}


export default new ArticleController()