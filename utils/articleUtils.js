import Review from '../models/review.js';
import Like from '../models/like.js';

export async function fetchReviewsAndLikes(articleId) {
    const reviews = await Review.find({ article: articleId }).populate('user', 'username');
    const likes = await Like.find({ article: articleId }).populate('user', 'username');
    return { reviews, likes };
}