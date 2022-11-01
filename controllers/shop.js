const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next)=>{
	// Product.find()                                    //Returns array, use .cursor() to return huge amounts of data
		// .then(products => {
			// res.render('shop/product-list', {
				// prods: products, 
				// pageTitle: 'All Products', 
				// path: '/products'
			// });
		// })
	const page = +req.query.page || 1;
	let totalItems;
	let lastPage;
	
	Product.find()
		.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			lastPage = Math.ceil(totalItems/ITEMS_PER_PAGE);
			return Product.find()
				.skip( (page - 1) * ITEMS_PER_PAGE )
				.limit(ITEMS_PER_PAGE);
		})
		.then(products => {
			res.render('shop/product-list', {
				prods: products, 
				pageTitle: 'Products', 
				path: '/products',
				totalProducts: totalItems,
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: lastPage
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
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
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
		});
		
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
	.catch(err => {
		const error = new Error(err);
		error.httpStatus = 500;
		return next(error);
	})
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product => {
			req.user.addToCart(product);
			return res.redirect('/cart');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
		});
};

exports.getIndex = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalItems;
	let lastPage;
	
	Product.find()
		.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			lastPage = Math.ceil(totalItems/ITEMS_PER_PAGE);
			return Product.find()
				.skip( (page - 1) * ITEMS_PER_PAGE )
				.limit(ITEMS_PER_PAGE);
		})
		.then(products => {
			res.render('shop/index', {
				prods: products, 
				pageTitle: 'Shop', 
				path: '/',
				totalProducts: totalItems,
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: lastPage
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatus = 500;
			return next(error);
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then(order => {
			if(!order){
				return next(new Error('No order found'));
			}
			if(order.user.userId.toString() !== req.user._id.toString()){
				return next(new Error('Unauthorized User'));
			}
			const invoiceName = 'invoice-' + orderId + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);
			const file = fs.createReadStream(invoicePath);
			
			pdfDoc = new PDFDocument();
			
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
			
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);
			
			pdfDoc.fontSize(26).text('Invoice', {
				underline: true
			});
			
			pdfDoc.text('-------------------------');
			
			order.products.forEach(prod => {
				pdfDoc.fontSize(14).text(prod.product.title + ': ' + prod.product.price + ' x ' + prod.quantity);
			});
			
			pdfDoc.fontSize(26).text('Total Price: ' + order.price);
			pdfDoc.end();
			// fs.readFile(invoicePath, (err, data) => {
				// if(err){
					// return next(err);
				// }
				// res.setHeader('Content-Type', 'application/pdf');
				// res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
				// res.send(data);
			// });
		})
		.catch(err => {
			next(err);
		});
};

exports.getCheckout = (req, res, next) => {
	req.user.populate('cart.items.productId')
		.then(user => {
			const products = user.cart.items;
			let total = 0;
			products.forEach(p => {
				total += p.quantity * p.productId.price;
			});
			res.render('shop/checkout', {
				path: '/checkout',
				pageTitle: 'Checkout',
				products: products,
				totalSum: total
		});
	})
	.catch(err => {
		const error = new Error(err);
		error.httpStatus = 500;
		return next(error);
	})
};