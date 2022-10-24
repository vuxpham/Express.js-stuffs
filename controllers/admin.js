const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{        
	res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
};

exports.postAddProduct = (req, res, next)=>{  
	console.log(req.user);
	const product = new Product(req.body.title, req.body.price, req.body.imageURL, req.body.description, null, req.user._id);
	product.save()
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err);});
};

exports.getAdminProducts = (req, res, next) => {
	Product.fetchAll()
	.then(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	})
	.catch(err => {
		console.log(err);
	});
	// req.user.getProducts()
		// .then(products => {
			// res.render('admin/products', {
				// prods: products, 
				// pageTitle: 'Admin Products', 
				// path: '/admin/products'
				// });
		// })
		// .catch(err => {console.log(err);});
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
			res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const product = new Product(
	req.body.title,
	req.body.price,
	req.body.imageURL,
	req.body.description,
	req.body.productId
	);
	product.save()
	.then(result => {
	  console.log('UPDATED PRODUCT!');
	  res.redirect('/admin/products');
	})
	.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteById(productId)
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {console.log(err)});
	
};