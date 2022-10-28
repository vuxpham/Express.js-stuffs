const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{        
	res.render('admin/edit-product', {
		pageTitle: 'Add Product', 
		path: '/admin/add-product', 
		editing: false, 
		isAuthenticated: req.session.isLoggedIn,
		errorMessage: null,
		hasError: false,
		product: {title: req.body.title, imageURL: req.body.imageURL, price: req.body.price, description: req.body.description},
		validationErrors: []
	});
};

exports.postAddProduct = (req, res, next)=>{  
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422)
			.render('admin/edit-product', {
				pageTitle: 'Add Product', 
				path: '/admin/add-product', 
				editing: false, 
				isAuthenticated: req.session.isLoggedIn,
				errorMessage: errors.array()[0].msg,
				hasError: true,
				product: {title: req.body.title, imageURL: req.body.imageURL, price: req.body.price, description: req.body.description},
				validationErrors: errors.array()
			});
	}
	const product = new Product({
		title: req.body.title, 
		price: req.body.price, 
		description: req.body.description, 
		imageURL: req.body.imageURL,
		userId: req.user                             //Only take the id from the object (the same as req.user._id)
	});
	product.save()
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err);});
};

exports.getAdminProducts = (req, res, next) => {
	Product.find({userId: req.user._id})
//	.populate('userId')                                   //Populate the referenced field with the full data
	.then(products => {
		console.log(products);
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	})
	.catch(err => {
		console.log(err);
	});
};

exports.getEditProduct = (req, res, next)=>{
	//Getting query parameter edit
	const editMode = req.query.edit; // This returns a string 
	if(!editMode)
	{
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			if(!product){
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product', 
				path: '/admin/edit-product', 
				editing: editMode, 
				product: product, 
				hasError: false,
				errorMessage: null,
				validationErrors: [],
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422)
			.render('admin/edit-product', {
				pageTitle: 'Edit Product', 
				path: '/admin/add-product', 
				editing: true, 
				isAuthenticated: req.session.isLoggedIn,
				errorMessage: errors.array()[0].msg,
				hasError: true,
				product: {title: req.body.title, imageURL: req.body.imageURL, price: req.body.price, description: req.body.description, _id: req.body.productId},
				validationErrors: errors.array()
			});
	}
	Product.findById(req.body.productId)
		.then(product => {
			if(product.userId.toString() !== req.user._id.toString()){
				return res.redirect('/');
			}
			product.title = req.body.title;
			product.price = req.body.price;
			product.imageURL = req.body.imageURL;
			product.description = req.body.description;
			product.save()
				.then(result => {
					res.redirect('/admin/products');
				});
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteOne({_id: productId, userId: req.user._id})
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err)});
	
};