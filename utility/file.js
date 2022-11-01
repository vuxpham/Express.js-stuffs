const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink("../ExpressJS-stuffs" + filePath, err => {
        if (err) {
            throw (err);
        }
    });
}


exports.deleteFile = deleteFile;