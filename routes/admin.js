const express = require('express');
const path = require('path');

const rootDir = require('../utility/path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();          

router.get('/products', isAuth, adminController.getAdminProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);  		              
																   
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;