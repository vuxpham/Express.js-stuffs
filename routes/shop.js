const path = require('path');
const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetail); 	// Tells express to look for variable productID. Must be after other 
																		//  /products/... becaause it counts this as a unique request and won't 
																		// run the other /products/.. requests after.

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);



router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);


router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;

