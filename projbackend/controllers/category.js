const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, category) => {
		if (err) {
			return res.status(400).json({
				error: 'Category Not Found in DB',
			});
		}
		req.category = category;
		next();
	});
};

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) {
			return res.status(400).json({
				error: 'Not able to save category in DB',
			});
		}
		res.json({ category }); //From here
	});
};

exports.getCategory = (req, res) => {
	return res.json(req.category); //we are taking this because of the above middleware
};

exports.getAllCategories = (req, res) => {
	Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({
				error: 'No categories found!',
			});
		}
		res.json(categories);
	});
};

exports.upadteCategory = (req, res) => {
	const category = req.category; //we are taking this because of the above middleware
	category.name = req.body.name;

	category.save((err, updatedCategory) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to update Category!',
			});
		}
		res.json(updatedCategory);
	});
};

exports.removeCategory = (req, res) => {
	const category = req.category;

	category.remove((err, removedCategory) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to remove the category',
			});
		}
		res.json({
			message: `${removedCategory.name} Successfully deleted!`,
		});
	});
};
