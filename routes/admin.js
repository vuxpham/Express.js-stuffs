const express = require('express');
const path = require('path');

const router = express.Router(); //A mini app

router.get('/add-product', (req, res, next)=>{        
	res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));      
});                            

router.post('/add-product', (req, res, next)=>{  //Can have same address because
	console.log(req.body);                             //2 code handles different requests
	                                                
	res.redirect('/');                              
});


module.exports = router;