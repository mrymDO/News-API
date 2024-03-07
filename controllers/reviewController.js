import Review from '../models/review.js';
import User from '../models/user.js';
import Article from '../models/article.js';

class ReviewController {

    async create(req, res) {
        const { userId } = req;
        const { articleId, content } = req.body;

        const existingArticle = await Article.findById(articleId);

        if (!existingArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const existingReview = await Review.findOne({ user: userId, article: articleId });

        if (existingReview) {
            return res.status(400).json({ message: 'User has already reviewed this article' });
        }

        const review = await Review.create({
            user: userId,
            article: articleId,
            content,
        });
        return res.status(201).json(review);
    }

    async getById(req, res) {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        return res.status(200).json(review);
    }

    async getAll(req, res) {
        const reviews = await Review.find();
        return res.status(200).json({
            count: reviews.length,
            reviews
        });
    }

    async update(req, res) {
        const { userId } = req;
        const { id } = req.params;
        const { content } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (userId !== review.user.toString()) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        review.content = content;
        review.updatedAt = Date.now();
        await review.save();

        return res.status(200).json(review);
    }

    async delete(req, res) {
        const { userId } = req;
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (userId !== review.user.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        await Review.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Review deleted' });
    }
}

export default new ReviewController();