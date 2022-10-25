const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://vupa2810:bong2003@cluster0.isx1j9n.mongodb.net/shop';

const app = express();  
const store = new MongoDbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});
const csrfProtection = csrf();      //Create csrf protection

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));  
app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files
														 
app.use(session({ 
	secret: 'my secret', 
	resave: false,                                       //Read express-session docs to see what this do
	saveUninitialized: false, 
	store: store 
}));   

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if(!req.session.user){
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose.connect(MONGODB_URI)
	.then(result => {
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});