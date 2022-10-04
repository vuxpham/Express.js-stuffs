
const express = require('express');

const app = express();  //create express object. Object is also a valid parameter for create server

//5 overloads of use() function, read doc to learn more

app.use('/', (req, res, next)=>{
	/......                               this code always runs
	next();                             //next() to move to next middleware after this
});


app.use('/add-product', (req, res, next)=>{ //this runs first   
	res.send('<h1>Add Produc Page</h1>');   //Handles request for route that starts with '/add-product'        
});                                         //Does not have next() so the middleware under does not execute after this. 


//Generally don't want next() after code that writes responses, like no writing after end(). 

app.use('/', (req, res, next)=>{            //handle request for every route that starts with '/'  
	res.send('<h1>Hello</h1>');             
});

app.listen(3000);                        
