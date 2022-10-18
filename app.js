const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   

// const adminRoutes = require('./routes/admin');   
// const shopRoutes = require('./routes/shop');
// const errorController = require('./controllers/error');

const mongoConnect = require('./utility/database');

const app = express();  

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

app.use(bodyParser.urlencoded({extended: false}));  

app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files

// app.use((req, res, next) => {
	// // User.findByPk(1)
		// // .then(user => {
			// // req.user = user;               //Assign a new field to req (user field does not exist so this can be done)
			                 
			// // next();							   //'user' is a sequelize object so it can also use sequelize methods
		// // })
		// // .catch(err => {console.log(err);});
// });

// app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code

// app.use(shopRoutes);

// app.use(errorController.getError);

mongoConnect(client => {
	console.log(client);
	app.listen(3000);
});