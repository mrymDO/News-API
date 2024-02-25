import Like from '../models/like.js';
import Article from '../models/article.js';
import User from '../models/user.js';

class LikeController{

    async create(req, res) {
        const { userId } = req;
        const { articleId, type } = req.body;

        const validTypes = ['upvote', 'downvote'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid like type' });
        }

        const user = await User.findById(userId);
        const article = await Article.findById(articleId);

        if (!user || !article) {
            return res.status(404).json({ message: 'User or Article not found' });
        }

        const existingLike = await Like.findOne({ user: userId, article: articleId });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked or disliked this article' });
        }

        const like = await Like.create({
            user: userId,
            article: articleId,
            type,
        });
        return res.status(201).json(like);
    }

    async delete(req, res) {
        const { userId } = req;
        const { id } = req.params;

        const like = await Like.findById(id);

        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        if (userId !== like.user.toString()) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        await Like.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Like deleted' });
    }

    async getAll(req, res) {
        const likes = await Like.find();
        return res.status(200).json(likes);
    }
}

export default new LikeController();