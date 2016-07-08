'use strict';


var config = require('./application-x-www-form-urlencoded.json');
var qs = require('querystring');
var type = require('zanner-typeof'), of = type.of;


// application/x-www-form-urlencoded
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
					var data = qs.parse(body);
					for (var d in data) {
						if (of(data[d], 'array')) continue;
						data[d] = [data[d]];
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
