'use strict';


var type = require('zanner-typeof'), of = type.of;
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	postSize: 'postSize', // number
	postAmount: 'postAmount' // number
};


// application/json
module.exports = function (nameSpace, optionSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;
			if (optionSpace && ('enable' in optionSpace) && !optionSpace['enable']) {
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
				var POST = ns.POST;
				var body = new Buffer('', options['encoding']);
				ns.request.on('data', function (chunk) {
					body += chunk;
					if (options['postSize']>0 && body.length>options['postSize']) {
						ns.request.connection.destroy();
						reject(new Error('Body too big'));
					}
				});
				ns.request.on('end', function () {
					var data = {}, items = JSON.parse(body);
					if (of(items, 'array')) {
						for (var i=0, I=options['postAmount']>0 ? Math.min(items.length, options['postAmount']) : items.length; i<I; i++) {
							var item = items[i];
							if (item.name in data) {
								data[item.name].push(item.value);
							}
							else {
								data[item.name] = [item.value];
							}
						}
						Object.assign(POST, data);
					}
					else if (of(items, 'object')) {
						if (options['postAmount']>0) {
							var itemKeys = Object.keys(items);
							for (var i=options['postAmount']; i<itemKeys.length; i++) {
								delete items[itemKeys[i]];
							}
						}
						Object.assign(POST, items);
					}
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
