
const express = require('express');

const app = express();  //create express object. Object is also a valid parameter for create server

app.use((req, res, next)=>{              //Middleware
	console.log("In middleware");
	next();                              //next() is required to move to the next middleware
});

app.use((req, res, next)=>{              //Another middleware
	console.log("In another middleware");
	res.send('<h1>Hello</h1>');
});

app.listen(3000);                        //the app function intializes a server object and passes in app function -> no need to create
                                         //server ourselves
