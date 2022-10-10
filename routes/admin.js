const express = require('express');
const path = require('path');

const rootDir = require('../utility/path');

const router = express.Router(); 

const products = [];            

router.get('/add-product', (req, res, next)=>{        
	res.sendFile(path.join(rootDir, 'views', 'add-product.html'));      
});                            

router.post('/add-product', (req, res, next)=>{  
	products.push({title: req.body.title});        //add user form input to the products array                           
	                                               //The products added to the array will be saved on server side 
	res.redirect('/');                             // => User B can see what user A logged. 
});


exports.routes = router;          //exports is an object, we give exports property routes = router
								  //property products = products
exports.products = products;       