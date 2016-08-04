'use strict';


var type = require('zanner-typeof'), of = type.of;


var reverse = function(a){
	var A = a.map(function(item, index){
		return item;
	});
	A.reverse();
	return A;
};


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['host init']);
	let RE = /^(?:[^\:]*?[\:][^\@]*?[\@])?(.*?)(?:[\:][\d]+)?$/i;
	let value = [];
	if(config.enable===true){
		let key = 'host';
		value = ns.request.headers[key] || '';
		switch(config.case){
			case 'lower':
				value = value.toLowerCase();
				break;
			case 'upper':
				value = value.toUpperCase();
				break;
		}
		value = value.replace(RE, '$1');
		value = value.split('.');
		if(config.reverse===true){
			value = reverse(value);
		}
	}
	ns.HOST = value;
	Object.freeze(ns.HOST);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['host init']);
	ns.host = function(){
		ns.log('DEBUG', 'engine::meta', ['call host']);
		let result = ns.HOST.join('.');
		ns.log('DEBUG', 'engine::meta', ['called host', result]);
		return result;
	};
	Object.freeze(ns.host);
};
module.exports.host = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['hostEqual init']);
	ns.hostEqual = function(h){
		ns.log('DEBUG', 'engine::meta', ['call hostEqual', h]);
		let result = false;
		if(of(h, 'array')){
			result = ns.hostEqual(h.join('.'));
		}
		else if(of(h, 'string')){
			result = ns.HOST.join('.')===h;
		}
		ns.log('DEBUG', 'engine::meta', ['called hostEqual', result]);
		return result;
	};
	Object.freeze(ns.hostEqual);
};
module.exports.hostEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['hostLike init']);
	ns.hostLike = function(h){
		ns.log('DEBUG', 'engine::meta', ['call hostLike', h]);
		let result = false;
		if(of(h, 'array')){
			result = h.some(function(item, index){
				return ns.hostLike(item);
			});
		}
		else if(of(h, 'regex')){
			result = h.test(ns.HOST.join('.'));
		}
		else{
			result = ns.hostEqual(h);
		}
		ns.log('DEBUG', 'engine::meta', ['called hostLike', result]);
		return result;
	};
	Object.freeze(ns.hostLike);
};
module.exports.hostLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['hostAuto init']);
	ns.hostAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call hostAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.hostAuto);
};
module.exports.hostAuto = auto;

