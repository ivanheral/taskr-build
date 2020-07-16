var fs = require('fs');

module.exports = {
    ists: (filename) => {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.ts|.tsx)$/i.test(filename)
    },
    create_folder: () => {
        if (!fs.existsSync('./cache')) {
            fs.mkdirSync('./cache');
        }
    },
    open_browser: (port) => {
        const open =
            process.platform == 'darwin' ?
            'open' :
            process.platform == 'win32' ?
            'start' :
            'xdg-open'

        require("child_process").exec(`${open} http://localhost:${port}`);
    }
}