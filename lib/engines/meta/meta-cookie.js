'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaCookie']);

			// cookie : 'cookie'
			//
			var COOKIE = ns.COOKIE = __string2cookie(ns.request.headers['cookie']);
			Object.freeze(ns.COOKIE);

			var COOKIE_TO_SET = ns.COOKIE_TO_SET = [];
			//Object.seal(ns.COOKIE_TO_SET);

			ns.cookie = function (name, value, options) {
				ns.log('TRACE', ['EngineMetaCookie.cookie', name, value, options]);
				return __object42value([ns.COOKIE, ns.COOKIE_TO_SET], name, value, options)
			};
			Object.freeze(ns.cookie);

			ns.cookieCommite = ns.cookieDone = ns.cookieSend = function () {
				ns.log('TRACE', ['EngineMetaCookie.cookieDone']);
				ns.response.setHeader('Set-Cookie', ns.COOKIE_TO_SET);
				ns.COOKIE_TO_SET = false;
				Object.freeze(ns.COOKIE_TO_SET);
			};
			Object.freeze(ns.cookieCommite);
			Object.freeze(ns.cookieDone);
			Object.freeze(ns.cookieSend);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaCookie done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaCookie', error]);
			reject('engineMetaCookie: ' + error);
		}
	});
};


var __string2cookie = function (O) {
	return (of(O, 'string') ? O : '')
		.split(';')
		.map(function (item) {
			return (new Buffer(item, 'ascii')).toString('utf8');
		})
		.map(function (item) {
			return /^(?:[\s]*(.*?)[\s]*[\=])?[\s]*(.*?)[\s]*$/ig.exec(item);
		})
		.filter(function (item) {
			return item[1];
		})
		.map(function (item) {
			return { name: item[1].trim(), value: item[2].trim() };
		});
};

var __object42value = function (items, name, value, options) {
	return value!==undefined ? __object4value(items[1], name, value, options) : __object2value(items[0], name);
};

var __object2value = function (items, name) {
	var index = items.findIndex(function (item) {
		return item.name==name;
	});
	return index<0 ? undefined : items[index].value;
};

var __object4value = function (items, name, value, options) {
	try {
		return name && items && items.push(__cookie2serialized(String(name), String(value), options))>=0 ? value : false;
	}
	catch (e) {
		return false;
	}
};

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
var __cookie2serialized = function (name, value, options) {
	var o = of(options, 'object') ? options : {};
	var encode = of(o.encode, 'function') ? o.encode : encodeURIComponent;
	var cookie = [];
	//
	var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
	if (name && !fieldContentRegExp.test(name)) {
		throw new TypeError('cookieSerialize argument name is invalid');
	}
	if (value && !fieldContentRegExp.test(value)) {
		throw new TypeError('cookieSerialize argument val is invalid');
	}
	//
	cookie.push(encode(name) + '=' + encode(value));
	of(o.maxAge, 'number') ? cookie.push('Max-Age=' + Math.floor(o.maxAge)) : 0;
	of(o.domain, 'string') && fieldContentRegExp.test(o.domain) ? cookie.push('Domain=' + o.domain) : 0;
	cookie.push('Path=' + (of(o.path, 'string') && fieldContentRegExp.test(o.path) ? o.path : '/'));
	(of(o.expires, 'data')) ? cookie.push('Expires=' + opt.expires.toUTCString()) : 0;
	(of(o.expires, 'number')) ? cookie.push('Expires=' + (new Date((new Date()).valueOf() + o.expires)).toUTCString()) : 0;
	(o.httpOnly) ? cookie.push('HttpOnly') : 0;
	(o.secure) ? cookie.push('Secure') : 0;
	// http://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/
	of(o.siteOnly, 'boolean') ? cookie.push('SameSite=' + (o.siteOnly ? 'Strict' : 'Lax')) : 0;
	of(o.siteOnly, 'string') ? cookie.push('SameSite=' + o.siteOnly) : 0;
	return cookie.join('; ');
};

