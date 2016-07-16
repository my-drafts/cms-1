'use strict';


var config = require('./config.json');
var application_x_www_form_urlencoded = require('./application_x_www_form_urlencoded');
var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineGet']);

			// get
			//
			// {
			//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
			//   'fieldName2': [ ... ],
			//   ...
			// }
			//
			var GET = ns.GET = {};
			var gets = ns.gets = function () {
				ns.log('TRACE', ['EngineGet.gets']);
				return __object2keys(GET);
			};
			var getAmount = ns.getAmount = function (name) {
				ns.log('TRACE', ['EngineGet.getAmount', name]);
				return __object2itemLength(GET, name);
			};
			var get = ns.get = function (name, index) {
				ns.log('TRACE', ['EngineGet.get', name, index]);
				return __object2item(GET, name, index);
			};
			Object.freeze(ns.gets);
			Object.freeze(ns.getAmount);
			Object.freeze(ns.get);

			// get extra
			//
			var getObjects = ns.getObjects = function (index) {
				ns.log('TRACE', ['EngineGet.getObjects', index]);
				return __objectWalk(GET, function (item, index, field) {
					return { field: field, value: item };
				});
			};
			Object.freeze(ns.getObjects);

			// loading
			//
			var loaded = undefined;
			var loading = application_x_www_form_urlencoded;
			var loadingOptions = config['application/x-www-form-urlencoded'];
			ns.loading = function (options) {
				return new Promise(function (resolve, reject){
					ns.log('TRACE', ['EngineGet.loading', options]);
					if (loaded!==undefined) {
						ns.log('TRACE', ['EngineGet.loading from loaded', loaded]);
						loaded>0 ? resolve(loaded===1 ? true : false) : reject(false);
					}
					else if (config['enable']) {
						ns.log('TRACE', ['EngineGet.loading enable']);
						loading(ns, Object.assign({}, config['*/*'], loadingOptions, options))
							.then(function (_ns) {
								ns.log('DEBUG', ['EngineGet.loading successes']);
								loaded = 1;
								Object.freeze(ns.GET);
								resolve(true);
							})
							.catch(function (_error) {
								ns.log('ERROR', ['EngineGet.loading unsuccesses', _error]);
								loaded = -1;
								reject(false);
							});
					}
					else {
						ns.log('TRACE', ['EngineGet.loading disable']);
						loaded = 2;
						resolve(false);
					}
				});
			};
			Object.freeze(ns.loading);

			//
			if ('autoLoading' in config && config['autoLoading']) {
				ns.loading({}).then(resolve, reject);
			}
			else {
				resolve(config['enable']);
			}
			ns.log('TRACE', ['EngineGet done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineGet', error]);
			reject('engineGet: ' + error);
		}
	});
};


var __object2keys = function (O) {
	return Object.keys(O);
};

var __object2itemLength = function (O, key) {
	return of(O[key], 'array') ? O[key].length : -1;
};

var __object2item = function (O, key, index) {
	var L = __object2itemLength(O, key);
	if (L===1) {
		return O[key][0];
	}
	else if (L > 1) {
		return of(index, 'number') ? O[key][((index % L) + L) % L] : O[key];
	}
	else {
		throw 'Error [EngineGet]: Unknown in __object2item';
	}
};

var __objectWalk = function (O, walk) {
	var result = [];
	var Okeys = __object2keys(O);
	for (var ikey=0; ikey<Okeys.length; ikey++) {
		var key = Okeys[ikey];
		var length = __object2itemLength(O, key);
		for (var index=0; index<length; index++) {
			var item = O[key][index];
			if (of(walk, 'function')) {
				var itemResult = walk(item, index, key);
				if (!of(itemResult, 'undefined')){
					item = itemResult;
				}
			}
			result.push(item);
		}
	}
	return result;
};

var __object2itemSub = function (O, sub, key, index) {
	var result = __object2item(O, key, index ? index : 0);
	if (of(sub, 'array')){
		for (var i=0; i<sub.length; i++){
			result = result[sub[i]];
		}
	}
	else{
		result = result[sub];
	}
	return result;
};

var __object2items = function (O, key) {
	if (of(key, 'string')) {
		return __objectWalk(O, function (item, index, field) {
			return item[key];
		});
	}
	else if (of(key, 'array')) {
		return __objectWalk(O, function (item, index, field) {
			var result = {};
			for (var i=0; i<key.length; i++) {
				result[key[i]] = item[key[i]];
			}
			return result;
		});
	}
	else {
		return __objectWalk(O);
	}
};
