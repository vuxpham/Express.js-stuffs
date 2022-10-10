const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   

const adminData = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const expressHbs = require('express-handlebars');   //Import handlebars package

const app = express();  

app.engine('handlebars', expressHbs());  //Create engine called 'handlebars' from object expressHbs
app.set('view engine', 'handlebars'); 
app.set('views', 'views');     //Access folder for the application's views

app.use(bodyParser.urlencoded({extended: false}));  

app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files
														 
app.use('/admin', adminData.routes);   //only addresses with '/admin' can run this code

app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).render('error', {pageTitle: 'Page not found'});     //Error page 
});

app.listen(3000);                        
