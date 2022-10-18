const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
	MongoClient.connect('mongodb+srv://vupa2810:bong2003@cluster0.isx1j9n.mongodb.net/?retryWrites=true&w=majority')
		.then(client => {
			console.log('Connected!');
			callback(client);
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = mongoConnect;

	
