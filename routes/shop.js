const path = require('path');
const express = require('express');

const rootDir = require('../utility/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next)=>{
	const products = adminData.products;
	res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'}); //Pass in an object that the .pug file can use         
});

module.exports = router;

