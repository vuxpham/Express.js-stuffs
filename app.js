const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');

const app = express();  

app.use(bodyParser.urlencoded({extended: false}));  

app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files
														 
app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code

app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, './', 'views', 'error.html'));     //Error page 
});

app.listen(3000);                        
