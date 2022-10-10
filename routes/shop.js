const path = require('path');
const express = require('express');

const rootDir = require('../utility/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next)=>{     
	res.render('shop'); //Already defined 'views' folder and 'pug' engine => automatically look for 'shop.pug' file in 'views' folder           
});

module.exports = router;

