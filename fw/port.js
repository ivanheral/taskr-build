const net = require('net');
module.exports = (port) => {

	return new Promise( resolve => {
		if( isNaN(port) || port != parseInt(port) ||port < 0 || port > 65535){
            resolve(false);
		}
		port = parseInt(port);
		const tester = net.createServer()
			.once('error', _err =>{resolve(false);
			})
			.once('listening', () => tester.once('close', () => resolve(true)).close())
			.listen(port);
    });
};
