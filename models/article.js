import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  content: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  reviews: [
    {
      type: mongoose.ObjectId,
      ref: 'Review',
    },
  ],
  likes: [
    {
      type: mongoose.ObjectId,
      ref: 'Like',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;