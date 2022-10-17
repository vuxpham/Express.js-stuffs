const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./utility/database');

const app = express();  

db.execute('SELECT * FROM products')        //db.execute returns 2 objects result and err
	.then(result => {
		console.log(result[0], result[1]);                //result is an array
	})
	.catch(err => {
		console.log(err);
	});

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

app.use(bodyParser.urlencoded({extended: false}));  

app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files
														 
app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code

app.use(shopRoutes);

app.use(errorController.getError);

app.listen(3000);                        
