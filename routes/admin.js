const express = require('express');
const path = require('path');

const rootDir = require('../utility/path');
const adminController = require('../controllers/admin');

const router = express.Router(); 

const products = [];            

router.get('/products', adminController.getAdminProducts);

router.get('/add-product', adminController.getAddProduct);  		              
																   
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product');

module.exports = router;