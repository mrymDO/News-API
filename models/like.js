import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  article: {
    type: mongoose.ObjectId,
    ref: 'Article',
    required: true,
  },
  type: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model('Like', likeSchema);

export default Like;