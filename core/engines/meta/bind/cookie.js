'use strict';


var a = require('./../lib/actions');
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


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['cookie init']);
	ns.COOKIE_TO_SET = [];
	let value = [];
	if(config.enable===true){
		let key = 'cookie';
		value = a.header2cookie(ns.request.headers[key] || '');
		Object.assign(cookieOptionsDefault, config);
		Object.freeze(cookieOptionsDefault);
	}
	else{
		Object.freeze(ns.COOKIE_TO_SET);
	}
	ns.COOKIE = value;
	Object.freeze(ns.COOKIE);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['cookie init']);
	ns.cookie = function(name, value, options){
		let result = false;
		if(value===undefined){
			ns.log('DEBUG', 'engine::meta', ['call cookie', name]);
			result = a.cookies2value(ns.COOKIE, name);
			ns.log('DEBUG', 'engine::meta', ['called cookie', result]);
		}
		else{
			ns.log('DEBUG', 'engine::meta', ['call cookie', name, value, options]);
			result = a.cookie4set(ns.COOKIE_TO_SET, name, value, Object.assign({}, cookieOptionsDefault, options));
		}
		return result;
	};
	Object.freeze(ns.cookie);
};
module.exports.cookie = get;


var send = function(ns){
	ns.log('TRACE', 'engine::meta', ['cookieSetSend init']);
	ns.cookieSetSend = function(){
		ns.log('DEBUG', 'engine::meta', ['call cookieSetSend']);
		let result = false;
		if(ns.COOKIE_TO_SET!==false){
			ns.response.setHeader('Set-Cookie', ns.COOKIE_TO_SET);
			ns.COOKIE_TO_SET = false;
			Object.freeze(ns.COOKIE_TO_SET);
			result = true;
		}
		ns.log('DEBUG', 'engine::meta', ['called cookieSetSend', result]);
		return result;
	};
	Object.freeze(ns.cookieSetSend);
	ns.cookieCommite = ns.cookieSetSend;
	Object.freeze(ns.cookieCommite);
	ns.cookieDone = ns.cookieSetSend;
	Object.freeze(ns.cookieDone);
	ns.cookieSend = ns.cookieSetSend;
	Object.freeze(ns.cookieSend);
};
module.exports.cookieSetSend = send;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['cookieAuto init']);
	ns.cookieAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call cookieAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.cookieAuto);
};
module.exports.cookieAuto = auto;

