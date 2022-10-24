const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   
const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();  

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({extended: false}));  
app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files

app.use((req, res, next) => {
	User.findById("6356333170c7b51219b99219")
		.then(user => {
			req.user = user;         
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code
app.use(shopRoutes);

app.use(errorController.getError);

mongoose.connect('mongodb+srv://vupa2810:bong2003@cluster0.isx1j9n.mongodb.net/shop?retryWrites=true&w=majority')
	.then(result => {
		User.findOne().then(user => {
			if(!user){
				const user = new User({
					name: 'Vu',
					email: 'test@gmail.com',
					cart: {
						items: []
					}
				});
				user.save();
			}
		})
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});