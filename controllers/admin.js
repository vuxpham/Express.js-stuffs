const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{        
	res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
};

exports.postAddProduct = (req, res, next)=>{  
	const product = new Product(null, req.body.title, req.body.imageURL, req.body.description, req.body.price);     
	product.save()
		.then(() => {
			res.redirect('/');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getAdminProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products'});
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
	Product.findById(prodId, product => {
		if(!product){
			return res.redirect('/');
		}
		res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product});
	});
	
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedProduct = new Product(prodId, req.body.title, req.body.imageURL, req.body.description, req.body.price);
	updatedProduct.save();
	res.redirect('/admin');
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteById(productId);
	res.redirect('/admin/products');
};