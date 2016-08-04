'use strict';


var strong_store_cluster = require('strong-store-cluster');
var of = require('zanner-typeof');


var header2cookie = function(O){
	let RE = /^(?:(.*?)[\=])?(.*?)$/ig;
	let split = function(item){
		return RE.exec(item);
	};
	let filter = function(item){
		return item[1];
	};
	let final = function(item){
		return {
			name: item[1].trim(),
			value: item[2].trim()
		};
	};
	return (new Buffer(O || '', 'ascii'))
		.toString('utf8')
		.split(';')
		.map(split)
		.filter(filter)
		.map(final);
};
module.exports.header2cookie = header2cookie;


// name: 'cookie-name'
// value: 'cookie-value'
// options = {
//   encode: 'function'
//   maxAge: 'number'
//   domain: 'string'
//   path: 'string'
//   expires: 'data' | 'number':+milliseconds
//   httpOnly: 'boolean'
//   secure: 'boolean'
//   siteOnly: 'boolean' | 'string':['Strict', 'Lax'];
// }
//
var cookie2serialize = function(name, value, options){
	let RE = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
	let o = of(options, 'object') ? options : {};
	let encode = of(o.encode, 'function') ? o.encode : encodeURIComponent;
	let cookie = [];

	// name + value
	if(name && !RE.test(name)){
		throw 'cookie2serialize name invalid';
	}
	else if(value && !RE.test(value)){
		throw 'cookie2serialize value invalid';
	}
	else{
		cookie.push(encode(name)+'='+encode(value));
	}

	// maxAge
	if(of(o.maxAge, 'number')){
		cookie.push('Max-Age='+Math.floor(o.maxAge));
	}

	// domain
	if(o.domain && RE.test(o.domain)){
		cookie.push('Domain='+o.domain);
	}

	// path
	cookie.push('Path='+(o.path && RE.test(o.path) ? o.path : '/'));

	// expires
	if(of(o.expires, 'data')){
		cookie.push('Expires='+o.expires.toUTCString());
	}
	else if(of(o.expires, 'number')){
		cookie.push('Expires='+(new Date((new Date()).valueOf()+o.expires)).toUTCString());
	}

	// httpOnly
	if(o.httpOnly){
		cookie.push('HttpOnly');
	}

	// secure
	if(o.secure){
		cookie.push('Secure');
	}

	// siteOnly
	//
	// http://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/
	if(of(o.siteOnly, 'boolean')){
		cookie.push('SameSite='+(o.siteOnly ? 'Strict' : 'Lax'));
	}
	else if(of(o.siteOnly, 'string')){
		cookie.push('SameSite='+o.siteOnly);
	}

	return cookie.join('; ');
};
module.exports.cookie2serialize = cookie2serialize;


var cookies2value = function(cookies, name){
	var index = cookies.findIndex(function(cookie){
		return cookie.name==name;
	});
	return index<0 ? undefined : cookies[index].value;
};
module.exports.cookies2value = cookies2value;


var cookie4set = function(cookies, name, value, options){
	let n = name;
	let v = value;
	let o = options || {};
	let cookie = cookie2serialize(n, v, o);
	let result = false;
	if(name){
		cookies.push(cookie);
		result = value;
	}
	return result;
};
module.exports.cookie4set = cookie4set;


// generate Id
var generateId = function(length){
	return Math.random().toString(36).substr(2).substr(0, Math.min(Math.max(length, 0), 16));
};
module.exports.generateId = generateId;


// generate unique Id
var generateUniqueId = function(length, checker, iterationMax, iteration){
	let max = iterationMax || 4;
	let it = iteration || 0;
	let next = function(resolve, reject){
		generateUniqueId(length, checker, it+1).then(resolve, reject);
	};
	let check = function(exists, id, resolve, reject){
		if(!exists){
			resolve(id);
		}
		else if(it>max){
			reject('many iteration in generateUniqueId');
		}
		else{
			next(resolve, reject);
		}
	};
	return new Promise(function(resolve, reject){
		let id = generateId(length);
		checker(id)
			.then(function(exists){
				check(exists, id, resolve, reject);
			})
			.catch(reject);
	});
};
module.exports.generateUniqueId = generateUniqueId;


var storeIdChecker = function(id, expires){
	let ssc = strong_store_cluster;
	let sid = 'session-'+id;
	return new Promise(function(resolve, reject){
		let collection = ssc.collection(sid);
		collection.configure({expireKeys: expires});
		let key = 'created';
		collection.get(key, function(error, value){
			if(error){
				reject(error);
			}
			else if(value===undefined){
				value = (new Date()).toUTCString();
				collection.set(key, value, function(error){
					error ? reject(error) : resolve({id: id, expires: false});
				});
			}
			else{
				resolve({id: id, exists: true});
			}
		});
	});
};
module.exports.storeIdChecker = storeIdChecker;


var storeDataGetter = function(id, expires){
	let ssc = strong_store_cluster;
	let sid = 'session-'+id;
	return new Promise(function(resolve, reject){
		let collection = ssc.collection(sid);
		collection.configure({expireKeys: expires});
		let key = 'data';
		collection.get(key, function(error, data){
			error ? reject(error) : resolve(JSON.parse(data));
		});
	});
};
module.exports.storeDataGetter = storeDataGetter;


var storeDataSetter = function(id, data, expires){
	let ssc = strong_store_cluster;
	let sid = 'session-'+id;
	return new Promise(function(resolve, reject){
		let collection = ssc.collection(sid);
		collection.configure({expireKeys: expires});
		let key = 'data';
		let value = JSON.stringify(data);
		collection.set(key, value, function(error){
			error ? reject(error) : resolve();
		});
	});
};
module.exports.storeDataSetter = storeDataSetter;


var sessionStartNew = function(ns){
	var checker = function(_id){
		return storeIdChecker(_id, ns.SESSION_EXPIRES);
	};
	return new Promise(function(resolve, reject){
		generateUniqueId(ns.SESSION_ID_LENGTH, checker, 0).then(function(_id){
			ns.log('DEBUG', ['EngineMetaSession.sessionStart new ok', _id]);
			ns.cookie(ns.SESSION_NAME, _id, {siteOnly: true});
			ns.SESSION_ID = _id;
			Object.freeze(ns.SESSION_ID);
			resolve(_id);
		}, reject);
	});
};
module.exports.sessionStartNew = sessionStartNew;


var value2case = function(config, value, defaultValue){
	if(config.enable!==true){
		return defaultValue;
	}
	else if (!of(value, 'string')){
		return defaultValue;
	}
	switch(config.case){
		case 'lower':
			return value.toLowerCase();
		case 'upper':
			return value.toUpperCase();
		default:
			return value;
	}
};
module.exports.value2case = value2case;
