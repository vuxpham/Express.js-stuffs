const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user'); 

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	}
	else{
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
		oldInput: {email: '', password: ''},
		validationErrors: []
	});
};

exports.getSignUp = (req, res, next) => {
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	}
	else{
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Sign Up',
		errorMessage: message,
		oldInput: {email: '', password: '', confirmPassword: ''},
		validationErrors: []
	});
};

exports.postSignUp = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		console.log(errors);
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Sign Up',
			errorMessage: errors.array()[0].msg,
			oldInput: {email: req.body.email, password: req.body.password, confirmPassword: req.body.confirmPassword},
			validationErrors: errors.array()
		});
	}
			bcrypt.hash(req.body.password, 12)        //Hash Password 12 times (12 is standard)
				.then(hashedPassword => {
					const user = new User({
						email: req.body.email,
						password: hashedPassword,
						cart: {items: []}
					});
					return user.save();
				})
				.then(result => {
					res.redirect('/login');
				})
				.catch(err => {
					const error = new Error(err);
					error.httpStatus = 500;
					return next(error);
				});
};

exports.postLogin = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg,
			oldInput: {email: req.body.email, password: req.body.password},
			validationErrors: errors.array()
		});
	}
	User.findOne({email: req.body.email})
		.then(user => {
			if(!user){
				return res.status(422).render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					errorMessage: 'Incorrect email or password!',
					oldInput: {email: req.body.email, password: req.body.password},
					validationErrors: [{param: 'email', param: 'password'}]
				});
			}
			bcrypt.compare(req.body.password, user.password)
				.then(match => {
					if(match){
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							res.redirect('/');
						});						
					}
					return res.status(422).render('auth/login', {
						path: '/login',
						pageTitle: 'Login',
						errorMessage: 'Incorrect email or password!',
						oldInput: {email: req.body.email, password: req.body.password},
						validationErrors: [{param: 'email', param: 'password'}]
					});
				})
				.catch(err => {
					const error = new Error(err);
					error.httpStatus = 500;
					return next(error);
				});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};	
