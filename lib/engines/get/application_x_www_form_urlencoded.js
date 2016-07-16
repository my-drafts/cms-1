'use strict';


var url = require('url');
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	getSize: 'getSize', // number
	getAmount: 'getAmount' // number
};


// application/x-www-form-urlencoded
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
					getSize: 1024 * 8, // 8kb
					getAmount: 8
				};
				for (var o in optionSpaceMap) {
					if (optionSpace && (o in optionSpace)){
						options[optionSpaceMap[o]] = optionSpace[o];
					}
				}

				// loading
				//
				var GET = ns.GET;
				var body = url.parse(ns.request.url, true);
				if (options['getSize']>0 && body.search.length>options['getSize']+1) {
					reject(new Error('Get too big'));
				}
				var items = body.query;
				if (options['getAmount']>0) {
					var itemKeys = Object.keys(items);
					for (var i=options['getAmount']; i<itemKeys.length; i++) {
						delete items[itemKeys[i]];
					}
				}
				Object.assign(GET, items);
				resolve(ns);
			}
		}
		catch (error) {
			reject(error);
		}
	});
};
