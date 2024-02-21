import Article from "../models/article"
import User from "../models/user"


class ArticleController {
  async get(req, res) {
    const { id } = req.params

    const article = Article.findById(id)

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    return res.status(200).json({ ...article })
  }

  async getAll(req, res) {

  }

  async add(req, res) {

  }

  async update(req, res) {

  }

  async delete(req, res) {
    const { userId } = req
    const { id } = req.params
    const user = User.findById(userId);
    const article = Article.findById(id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }
    if (user.role == 'admin' || userId == article.author) {
      Article.deleteOne({ _id: id });
      return res.status(200).json({ message: "Article deteled" })
    }

    return res.status(400).json({ messgae: "cannot delete article" })
  }
}


export default new ArticleController()