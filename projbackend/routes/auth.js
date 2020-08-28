const express = require('express');
const router = express.Router();
const {
	signOut,
	signUp,
	signIn,
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require('../controllers/auth');
const { body, validationResult } = require('express-validator');

router.post(
	'/signup',
	[
		body('name')
			.isLength({ min: 3 })
			.withMessage('name must be at least 3 chars long'),
		body('email').isEmail().withMessage('email is required'),
		body('password')
			.isLength({ min: 3 })
			.withMessage('password should be at least 3 chars long'),
	],
	signUp
);

router.post(
	'/signin',
	[
		body('email').isEmail().withMessage('email is required'),
		body('password')
			.isLength({ min: 3 })
			.withMessage('password field is compulsory!'),
	],
	signIn
);

router.get('/signout', signOut);

router.get('/test', isSignedIn, isAdmin, (req, res) => {
	res.json(req.auth);
});

module.exports = router;
