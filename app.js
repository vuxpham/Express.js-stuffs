const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');   

const adminRoutes = require('./routes/admin');   
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utility/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();  

app.set('view engine', 'ejs'); 
app.set('views', 'views');     //Access folder for the application's views

app.use(bodyParser.urlencoded({extended: false}));  

app.use(express.static(path.join(__dirname, 'public'))); //Grant read only access to the static folder public (accessing
                                                         //directly through the path in the files

app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user;               //Assign a new field to req (user field does not exist so this can be done)
			                 
			next();							   //'user' is a sequelize object so it can also use sequelize methods
		})
		.catch(err => {console.log(err);});
});

app.use('/admin', adminRoutes);   //only addresses with '/admin' can run this code

app.use(shopRoutes);

app.use(errorController.getError);


Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem});

sequelize
	// .sync({force: true})
	.sync()
	.then(result => {
		return User.findByPk(1); //Check if a dummy user already exist
	})
	.then(user => {
		if(!user){
			return User.create({name: 'Vu', email: 'test@gmail.com'});
		}
		return user;
	})
	.then(user => {
		return user.createCart();		
	})
	.then(cart => {
		app.listen(3000);
	})
	.catch(err => {console.log(err)});

                        
