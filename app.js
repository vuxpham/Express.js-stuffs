
const express = require('express');
const bodyParser = require('body-parser');      //install with npm install --save body-parser

const app = express();  

app.use(bodyParser.urlencoded({extended: false}));  //parse the body array in streams and buffer model like we did before but now it's automatic

app.post('/add-product', (req, res, next)=>{        //app.post() function only run when the url is access with post method
	res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');      
});                            

app.use('/product', (req, res, next)=>{
	console.log(req.body);                          //req.body is a null prototype object, so it does not have the default object functions like
	                                                //toString(),...
	res.redirect('/');                              //redirect the page to '/'
});

app.use('/', (req, res, next)=>{            
	res.send('<h1>Hello</h1>');             
});

app.listen(3000);                        
