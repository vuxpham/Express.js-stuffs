const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://vupa2810:bong2003@cluster0.isx1j9n.mongodb.net/shop';

const app = express();  
const store = new MongoDbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});
const csrfProtection = csrf();      //Create csrf protection

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
		cb(null, true);
	}
	else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({extended: false}));  
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));                        // Multer Processing Image Files
app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files
														 
app.use('/images', express.static(path.join(__dirname, 'images')));
														 
app.use(session({ 
	secret: 'my secret', 
	resave: false,                                       //Read express-session docs to see what this do
	saveUninitialized: false, 
	store: store 
}));   

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if(!req.session.user){
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if(!user){
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});



app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.getError500);

app.use(errorController.getError);

app.use((error, req, res, next) => {            // Special Error Middleware
	//res.redirect('/500');                       // If many error middlewares, they run from top to bottom
	res.status(500).render('error-500', {
		pageTitle: 'Error', 
		path: '/500', 
		isAuthenticated: req.session.isLoggedIn
	});    
	
});

mongoose.connect(MONGODB_URI)
	.then(result => {
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});