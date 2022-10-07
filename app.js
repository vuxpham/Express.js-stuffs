const express = require('express');
const bodyParser = require('body-parser');   

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');

const app = express();  

app.use(bodyParser.urlencoded({extended: false}));  

app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code

app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).send('<h1>Page not found</h1>');     //Error page 
});

app.listen(3000);                        
