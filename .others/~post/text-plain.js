'use strict';


var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	postSize: 'postSize', // number
	postAmount: 'postAmount' // number
};


// text/plain
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
					body = body.toString(options['encoding']);
					var data = {}, items = body.split(/[\r][\n]/i, options['postAmount']>0 ? options['postAmount'] : undefined);
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
					Object.assign(POST, data);
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
