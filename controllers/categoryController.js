import Category from '../models/category.js';
import User from '../models/user.js';

class CategoryController {
    async getAll(req, res) {
        const categories = await Category.find();
        return res.status(200).json(categories);
    }

    async getById(req, res) {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    }

    async add(req, res) {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const newCategory = await Category.create({
            name,
            description,
        });
        return res.status(201).json(newCategory);
    }

    async update(req, res) {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }

        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true}
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(updatedCategory);
    }

    async delete(req, res) {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }

        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted' });
    }
}

export default new CategoryController();