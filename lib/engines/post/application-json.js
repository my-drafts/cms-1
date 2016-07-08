'use strict';


var config = require('./application-json.json');
var type = require('zanner-typeof'), of = type.of;


// application/json
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
					var data = {}, items = JSON.parse(body);
					if (of(items, 'array')) {
						for (var i=0; i<items.length; i++) {
							var item = items[i];
							if (item.name in data) {
								data[item.name].push(item.value);
							}
							else {
								data[item.name] = [item.value];
							}
						}
						ns.POST = Object.assign(ns.POST, data);
					}
					else if (of(items, 'object')) {
						ns.POST = Object.assign(ns.POST, items);
					}
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
