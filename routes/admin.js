const express = require('express');

const router = express.Router(); //A mini app

router.get('/add-product', (req, res, next)=>{        
	res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');      
});                            

router.post('/add-product', (req, res, next)=>{  //Can have same address because
	console.log(req.body);                             //2 code handles different requests
	                                                
	res.redirect('/');                              
});


module.exports = router;