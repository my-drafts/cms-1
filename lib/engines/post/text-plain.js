'use strict';


var config = require('./text-plain.json');


// text/plain
module.exports = function (nameSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;
			if (config['enable']){
				var body = new Buffer('', config['encoding']);
				ns.request.on('data', function (chunk) {
					body += chunk;
					if (body.length > config['maxPostSize']) {
						ns.request.connection.destroy();
						reject(new Error('Body too big'));
					}
				});
				ns.request.on('end', function () {
					body = body.toString(config['encoding']);
					var data = {}, items = body.split(/[\r][\n]/i);
					for (var i=0; i<items.length; i++) {
						var item = items[i];
						item = /^([^\=]*)[\=](.*)$/.exec(item);
						if (item[1] in data) {
							data[item[1]].push(item[2]);
						}
						else {
							data[item[1]] = [item[2]];
						}
					}
					ns.POST = Object.assign(ns.POST, data);
					resolve(ns);
				});
				ns.request.on('error', function (error) {
					reject(error);
				});
			}
			else {
				resolve(ns);
			}
		}
		catch (error) {
			reject(error);
		}
	});
};
