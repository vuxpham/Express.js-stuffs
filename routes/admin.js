const express = require('express');
const path = require('path');

const rootDir = require('../utility/path');
const productsController = require('../controllers/products');

const router = express.Router(); 

const products = [];            

router.get('/add-product', productsController.getAddProduct);  		//No () because we don't want to run the function, we just want to              
																   //reference it
router.post('/add-product', productsController.postAddProduct);

module.exports = router;