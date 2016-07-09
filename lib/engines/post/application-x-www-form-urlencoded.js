'use strict';


var qs = require('querystring');
var type = require('zanner-typeof'), of = type.of;
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	postSize: 'postSize', // number
	postAmount: 'postAmount' // number
};


// application/x-www-form-urlencoded
module.exports = function (nameSpace, optionSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;
			if (optionSpace && !optionSpace['enable']) {
				resolve(ns);
			}
			else {
				// options
				//
				var options = {
					encoding: 'utf8',
					postSize: 1024 * 8, // 8kb
					postAmount: 8
				};
				for (var o in optionSpaceMap) {
					if (optionSpace && (o in optionSpace)){
						options[optionSpaceMap[o]] = optionSpace[o];
					}
				}

				// uploading
				//
				var body = new Buffer('', options['encoding']);
				ns.request.on('data', function (chunk) {
					body += chunk;
					if (options['postSize']>0 && body.length>options['postSize']) {
						ns.request.connection.destroy();
						reject(new Error('Body too big'));
					}
				});
				ns.request.on('end', function () {
					var data = qs.parse(body, undefined, undefined, options['postAmount']>0 ? { maxKeys: options['postAmount'] } : {});
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
		}
		catch (error) {
			reject(error);
		}
	});
};
