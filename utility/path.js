const path = require('path');


//Return path to root file that runs the application (app.js)

module.exports = path.dirname(process.mainModule.filename); 