const path = require('path');
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/checkout', shopController.getCheckout);

router.get('/products/:productId', shopController.getProductDetail); 	// Tells express to look for variable productID. Must be after other 
																		// /products/... becaause it counts this as a unique request and won't 
																		// run the other /products/.. requests after.



router.get('/', shopController.getIndex);

router.get('/orders', shopController.getOrders);

module.exports = router;

