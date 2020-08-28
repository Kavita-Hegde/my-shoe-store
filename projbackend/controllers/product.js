const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');

exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate('category')
		.exec((err, product) => {
			if (err) {
				return res.status(400).json({
					error: 'Product Not Found in DB',
				});
			}
			req.product = product;
			next();
		});
};

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.createProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: 'Problem with the image',
			});
		}

		//destructure the field
		const { name, description, price, category, stock } = fields;

		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
				error: 'Please include all the fields!',
			});
		}

		let product = new Product(fields);

		//handle file here
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: 'File size too big!',
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		//save to db
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: 'Saving shoe in DB failed',
				});
			}
			res.json(product);
		});
	});
};

exports.upadteProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: 'Problem with the image',
			});
		}
		//updation code
		let product = req.product;
		product = _.extend(product, fields);

		//handle file here
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: 'File size too big!',
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		//save to db
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: 'Updation of product failed!',
				});
			}
			res.json(product);
		});
	});
};

exports.removeProduct = (req, res) => {
	const product = req.product;

	product.remove((err, removedProduct) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to remove the Product',
			});
		}
		res.json({
			message: `${removedProduct.name} Successfully deleted!`,
		});
	});
};

//listing all products
exports.getAllProducts = (req, res) => {
	// let limit = req.query.limit ? parseInt(req.query.limit) : 8;
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	Product.find()
		.populate('category')
		.select('-photo')
		.sort([[sortBy, 'asc']])
		// .limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: 'No product found!',
				});
			}
			res.json(products);
		});
};

exports.getAllUniqueCategories = (req, res) => {
	Product.distinct('category', {}, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: 'No category Found!',
			});
		}
		res.json(category);
	});
};

exports.updateStock = (req, res, next) => {
	let myOperations = req.body.order.products.map((product) => {
		return {
			updateOne: {
				filter: { _id: product._id },
				update: { $inc: { stock: -product.count, sold: +product.count } }, //count is from front end
			},
		};
	});
	Product.bulkWrite(myOperations, {}, (err, product) => {
		if (err) {
			return res.status(400).json({
				error: 'Bulk operations failed!',
			});
		}
		next();
	});
};
