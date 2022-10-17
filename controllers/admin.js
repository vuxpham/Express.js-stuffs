const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{        
	res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
};

exports.postAddProduct = (req, res, next)=>{  
	Product.create({
		title: req.body.title,
		price: req.body.price,
		imageURL: req.body.imageURL,
		description: req.body.description
	})
	.then(result => {
		res.redirect('/admin/products');
	})
	.catch(err => {console.log(err);});
};

exports.getAdminProducts = (req, res, next) => {
	Product.findAll()
		.then(products => {
			res.render('admin/products', {
				prods: products, 
				pageTitle: 'Admin Products', 
				path: '/admin/products'
				});
		})
		.catch(err => {console.log(err);});
};

exports.getEditProduct = (req, res, next)=>{
	//Getting query parameter edit
	const editMode = req.query.edit; // This returns a string 
	if(!editMode)
	{
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findByPk(prodId)
		.then(product => {
			if(!product){
				return res.redirect('/');
			}
			res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then(product => {
			product.title = req.body.title;
			product.price = req.body.price;
			product.description = req.body.description;
			product.imageURL = req.body.imageURL;
			return product.save();
			
		})
		.then(result => {
			console.log('UPDATED PRODUCT!');
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err);});
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findByPk(productId)
		.then(product => {
			return product.destroy();
		})
		.then(result => {
			console.log('PRODUCT DELETED!!');
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err)});
	
};