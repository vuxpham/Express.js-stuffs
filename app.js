const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   



const mongoConnect = require('./utility/database').mongoConnect;
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
	User.findById("63520f933de338d3b1edd798")
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id);         
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code
app.use(shopRoutes);

app.use(errorController.getError);

mongoConnect(() => {
	app.listen(3000);
});