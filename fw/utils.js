var extname = require('path').extname;
var fs = require('fs');

module.exports = {
    ists: function (filename) {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.ts|.tsx)$/i.test(filename)
    },
    isjsx: function (filename) {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.jsx)$/i.test(filename)
    },
    create_folder: function () {
        if (!fs.existsSync('./cache')) {
            fs.mkdirSync('./cache');
        }
    }
}