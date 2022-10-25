const bcrypt = require('bcryptjs');

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
		errorMessage: message
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
		errorMessage: message
	});
};

exports.postSignUp = (req, res, next) => {
	User.findOne({email: req.body.email})
		.then(userData => {
			if(userData){
				req.flash('error', 'This email already exists!');
				return res.redirect('/signup');
			}
			return bcrypt.hash(req.body.password, 12)        //Hash Password 12 times (12 is standard)
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
				});       
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postLogin = (req, res, next) => {
	User.findOne({email: req.body.email})
		.then(user => {
			if(!user){
				req.flash('error', 'Invalid email or password!');
				return res.redirect('/login');
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
					req.flash('error', 'Invalid email or password!');
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};	
