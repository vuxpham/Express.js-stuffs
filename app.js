const http = require('http');

const express = require('express');

const app = express();  //create express object. Object is also a valid parameter for create server

app.use((req, res, next)=>{              //Middleware
	console.log("In middleware");
	next();                              //next() is required to move to the next middleware
});

app.use((req, res, next)=>{              //Another middleware
	console.log("In another middleware");
});

const server = http.createServer();

server.listen(3000);
