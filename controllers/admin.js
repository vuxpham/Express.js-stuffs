const { validationResult } = require('express-validator');

const Product = require('../models/product');
const fileHelper = require('../utility/file');

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
	if(!req.file){
		return res.status(422)
			.render('admin/edit-product', {
				pageTitle: 'Add Product', 
				path: '/admin/add-product', 
				editing: false, 
				isAuthenticated: req.session.isLoggedIn,
				errorMessage: 'Uploaded file can only be in .png, .jpg or .jpeg format',
				hasError: true,
				product: {title: req.body.title, price: req.body.price, description: req.body.description},
				validationErrors: []
			});
	}
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
				product: {title: req.body.title, price: req.body.price, description: req.body.description},
				validationErrors: errors.array()
			});
	}
	
	const imageURL = '/' + req.file.path;
	
	const product = new Product({
		title: req.body.title, 
		price: req.body.price, 
		description: req.body.description, 
		imageURL: imageURL,
		userId: req.user                             //Only take the id from the object (the same as req.user._id)
	});
	product.save()
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
			// return res.status(422)
			// .render('admin/edit-product', {
				// pageTitle: 'Add Product', 
				// path: '/admin/add-product', 
				// editing: false, 
				// isAuthenticated: req.session.isLoggedIn,
				// errorMessage: 'Database Operation Failed, Please try again',
				// hasError: true,
				// product: {title: req.body.title, imageURL: req.body.imageURL, price: req.body.price, description: req.body.description},
				// validationErrors: []
			// });
		});
};

exports.getAdminProducts = (req, res, next) => {
	Product.find({userId: req.user._id})
//	.populate('userId')                                   //Populate the referenced field with the full data
	.then(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	})
	.catch(err => {
		const error = new Error(err);
		error.httpStatus = 500;
		return next(error);
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
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
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
				product: {title: req.body.title, price: req.body.price, description: req.body.description, _id: req.body.productId},
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
			if(req.file){
				fileHelper.deleteFile(product.imageURL);
				product.imageURL = '/' + req.file.path;
			}
			product.description = req.body.description;
			product.save()
				.then(result => {
					res.redirect('/admin/products');
				});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	  const prodId = req.params.productId;
	  Product.findById(prodId)
			.then(product => {
				if (!product) {
					return next(new Error('Product not found.'));
				}
				fileHelper.deleteFile(product.imageURL);
				return Product.deleteOne({ _id: prodId, userId: req.user._id });
			})
			.then(() => {
				console.log('DESTROYED PRODUCT');
				res.status(200).json({message: 'Success!'});
			})
			.catch(err => {
				res.status(500).json({message: 'Product Deletion Failed!'});
			});
};