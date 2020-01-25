var fs = require('fs');

module.exports = {
    ists: (filename) => {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.ts|.tsx)$/i.test(filename)
    },
    create_folder: () => {
        if (!fs.existsSync('./cache')) {
            fs.mkdirSync('./cache');
        }
    }
}