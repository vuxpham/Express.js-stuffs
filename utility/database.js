const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'node-complete',
	password: 'bong2003'
});

module.exports = pool.promise();