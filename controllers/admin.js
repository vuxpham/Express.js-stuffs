const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{        
	res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false, isAuthenticated: req.session.isLoggedIn});
};

exports.postAddProduct = (req, res, next)=>{  
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
	Product.find()
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
			res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product, isAuthenticated: req.session.isLoggedIn});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	Product.findById(req.body.productId).then(product => {
		product.title = req.body.title;
		product.price = req.body.price;
		product.imageURL = req.body.imageURL;
		product.description = req.body.description;
		product.save()
	})
	.then(result => {
	  res.redirect('/admin/products');
	})
	.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findByIdAndRemove(productId)
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err)});
	
};