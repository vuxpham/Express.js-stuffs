const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect('mongodb+srv://vupa2810:bong2003@cluster0.isx1j9n.mongodb.net/shop?retryWrites=true&w=majority')
		.then(client => {
			console.log('Connected!');
			_db = client.db();
			callback(client);
		})
		.catch(err => {
			console.log(err);
			throw err;
		});
};


const getDb = () => {
	if(_db){
		return _db;
	}
	throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

	
