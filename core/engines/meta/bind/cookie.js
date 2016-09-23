'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var cookieOptionsDefault = {
	maxAge: null,
	domain: null,
	path: "/",
	expires: null,
	httpOnly: null,
	secure: null,
	siteOnly: null
};
Object.freeze(cookieOptionsDefault);
var cookieOptions = Object.assign({}, cookieOptionsDefault);
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
// siteOnly:
// http://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/
//
var cookie2serialize = function(name, value, options){
	let RE = /^(?:[\u0009-\u000b]|[\u000d]|[\u0020-\u007e])+$/; // [\u0080-\u00ff]

	if(!name || !RE.test(name) || !value || !RE.test(value)){
		return false;
	}

	let cookie = [];
	let o = of(options, 'object') ? options : {};
	let encode = of(o.encode, 'function') ? o.encode : encodeURIComponent;

	// name + value
	cookie.push(encode(name)+'='+encode(value));

	// maxAge
	of(o.maxAge, 'number') ? cookie.push('Max-Age='+Math.floor(o.maxAge)) : 0;

	// domain
	(!o.domain || !RE.test(o.domain)) ? 0 : cookie.push('Domain='+o.domain);

	// path
	cookie.push('Path='+(!o.path || !RE.test(o.path) ? '/' : o.path));

	// expires
	if(of(o.expires, 'data')){
		cookie.push('Expires='+o.expires.toUTCString());
	}
	else if(of(o.expires, 'number')){
		cookie.push('Expires='+(new Date((new Date()).valueOf()+o.expires)).toUTCString());
	}

	// httpOnly
	(o.httpOnly) ? cookie.push('HttpOnly') : 0;

	// secure
	(o.secure) ? cookie.push('Secure') : 0;

	// siteOnly
	if(of(o.siteOnly, 'boolean')){
		cookie.push('SameSite='+(o.siteOnly ? 'Strict' : 'Lax'));
	}
	else if(of(o.siteOnly, 'string')){
		cookie.push('SameSite='+o.siteOnly);
	}

	return cookie.join('; ');
};
var header2cookie = function(cookieHeader){
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
	return (new Buffer(cookieHeader || '', 'ascii'))
		.toString('utf8')
		.split(';')
		.map(split)
		.filter(filter)
		.map(final);
};
var get = function(ns, name, quiet){
	let cookies = ns.g('COOKIE');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-cookie.get', ['call', name]);
	var index = cookies.findIndex(function(cookie){
		return cookie.name==name;
	});
	let result = index<0 ? undefined : cookies[index].value;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-cookie.get', ['called', result]);
	return result;
};
var set = function(ns, name, value, options, quiet){
	let cookies = ns.g('COOKIE_TO_SEND');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-cookie.set', ['call', name, value, options]);
	let cookie = cookie2serialize(name, value, Object.assign({}, cookieOptions, options || {}));
	if(name && cookie){
		cookies.push(cookie);
		return value;
	}
	return false;
};
var send = function(ns, quiet){
	let cookies = ns.g('COOKIE_TO_SEND');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-cookie.send', ['call']);
	let result = false;
	if(of(cookies, 'array') && cookies.length>0){
		ns.response.setHeader('Set-Cookie', cookies);
		//ns.s('COOKIE_TO_SEND', false, true); // to prevent multi-send
		result = true;
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-cookie.send', ['called', result]);
	return result;
};


var init = function(ns, config){
	ns.log('TRACE', 'engine.meta-cookie.init', []);
	cookieOptions = Object.assign({}, cookieOptions, config.options);
	Object.freeze(cookieOptions);
	ns.s('COOKIE', (config.enable===true) ? header2cookie(ns.request.headers['cookie'] || '') : [], true);
	ns.s('COOKIE_TO_SEND', [], config.enable!==true);
	ns.s('cookie', function(name, value, options){
		if(value===undefined) return get(ns, name, config.quiet);
		else if(config.enable!==true) return set(ns, name, value, options, config.quiet);
		else return undefined;
	}, true);
	ns.s('cookieSend', function(){
		return send(ns, config.quiet);
	}, true);
	return Promise.resolve({cookie: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-cookie.auto', []);
	return Promise.resolve({cookie: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-cookie.done', []);
	if(config.enable===true && config.done===true){
		ns.c('cookieSend');
	}
	return Promise.resolve({cookie: config.enable===true});
};
module.exports.done = done;

