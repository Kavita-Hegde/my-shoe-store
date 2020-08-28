const express = require('express');
const router = express.Router();

const {
	getProductById,
	createProduct,
	getAllProducts,
	getProduct,
	photo,
	upadteProduct,
	removeProduct,
	getAllUniqueCategories,
} = require('../controllers/product');
const { isAuthenticated, isSignedIn, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

//params
router.param('userId', getUserById);
router.param('productId', getProductById);
//actual routes

//create
router.post(
	'/product/create/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createProduct
);

//read
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);

//update
router.put(
	'/product/:productId/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upadteProduct
);

//delete
router.delete(
	'/product/:productId/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	removeProduct
);

//listing route
router.get('/products', getAllProducts);

router.get('/products/categories', getAllUniqueCategories);

module.exports = router;
