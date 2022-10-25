const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next)=>{
	Product.find()                                    //Returns array, use .cursor() to return huge amounts of data
		.then(products => {
			res.render('shop/product-list', {
				prods: products, 
				pageTitle: 'All Products', 
				path: '/products'
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProductDetail = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product, 
				pageTitle: product.title, 
				path: '/products'
			});
		})
		.catch(err => {console.log(err);});
		
};

exports.getCart = (req, res, next) => {
	req.user.populate('cart.items.productId')
		.then(user => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products
		});
	})
	.catch(err => {console.log(err);})
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product => {
			req.user.addToCart(product);
			return res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				prods: products, 
				pageTitle: 'Shop', 
				path: '/'
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then(user => {
			const products = user.cart.items.map(item => {
				return { product: {...item.productId._doc}, quantity: item.quantity };   //Spread all the data in item.ProductId to object product 
			});
			
			let totalPrice = 0;
			products.forEach(p => {
				totalPrice = totalPrice + p.product.price*p.quantity;
			});
			
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user
				},
				products: products,
				price: totalPrice
			});
			return order.save();
		})
		.then(result => {
			req.user.clearCart();
		})
		.then(result => {
			res.redirect('/orders');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({'user.userId': req.user._id})
		.then(orders => {                       
			res.render('shop/orders', {
				pageTitle: 'Orders', 
				path: '/orders',
				orders: orders
				});			
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	req.user.deleteFromCart(productId)
		.then(result => {
			console.log(result);
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

