const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [
		body('email')
			.isEmail()
			.withMessage('Please enter a valid Email address')
			.normalizeEmail(),
		body('password', 'Please enter a valid Password')
			.isLength({min: 5})
			.isAlphanumeric()
	], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup', 
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid Email address')
			.custom((value, {req}) => {                                          // Throw Custom Error
				return User.findOne({email: value})
					.then(userData => {
						if(userData){
							return Promise.reject('This Email already exists');
						}
					})
			})
			.normalizeEmail(),
		body('password', 'Please enter a password with only letters and numbers and at least 5 characters')
			.isLength({min: 5})
			.isAlphanumeric(),
		body('confirmPassword')
			.custom((value, {req}) => {
				if(value !== req.body.password){
					throw new Error('Passwords must match');
				}
			})
	],
	authController.postSignUp);

module.exports = router;