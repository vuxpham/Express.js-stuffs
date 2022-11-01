const express = require('express');
const path = require('path');
const { check, body } = require('express-validator');

const rootDir = require('../utility/path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();          

router.get('/products', isAuth, adminController.getAdminProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);  		              
																   
router.post('/add-product', isAuth, [
	body('title')
		.isString()
		.withMessage("Product's title must only contain letters and numbers")
		.isLength({min: 5})
		.trim()
		.withMessage("Product's title must be at least 5 characters long"),
	body('price')
		.isFloat()
		.withMessage("Invalid price"),
	body('description')
		.isLength({min: 3})
		.withMessage("Product's description must be at least 3 characters long")
], adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, [
	body('title')
		.isString()
		.withMessage("Product's title must only contain letters and numbers")
		.isLength({min: 5})
		.trim()
		.withMessage("Product's title must be at least 5 characters long"),
	body('price')
		.isFloat()
		.withMessage("Invalid price"),
	body('description')
		.isLength({min: 3})
		.withMessage("Product's description must be at least 3 characters long")
], adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;