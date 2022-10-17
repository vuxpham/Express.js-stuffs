const Sequelize = require('sequelize');

//Constructor creates a pool connection with the database from localhost

const sequelize = new Sequelize('node-complete', 'root', 'bong2003', {
	dialect: 'mysql', 
	host: 'localhost'
});

module.exports = sequelize;