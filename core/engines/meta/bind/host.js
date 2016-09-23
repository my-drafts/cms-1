'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var reverse = function(a){
	var A = a.map(function(item, index){
		return item;
	});
	A.reverse();
	return A;
};
var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.get', ['call']);
	let result = ns.g('HOST').join('.');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.get', ['called', result]);
	return result;
};
var equal = function(ns, h, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.equal', ['call', h]);
	let result = false;
	if(of(h, 'array')){
		result = equal(ns, h.join('.'), true);
	}
	else if(of(h, 'string')){
		result = get(ns, true)===h;
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.equal', ['called', result]);
	return result;
};
var like = function(ns, h, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.like', ['call', h]);
	let result = false;
	if(of(h, 'array')){
		result = h.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(h, 'regexp')){
		result = h.test(get(ns, true));
	}
	else{
		result = equal(ns, h, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-host.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-host.init', []);
	if(config.enable===true){
		let RE = /^(?:[^\:]*?[\:][^\@]*?[\@])?(.*?)(?:[\:][\d]+)?$/i;
		let host = a.value2case(config, ns.request.headers['host'], '');
		host = host.replace(RE, '$1');
		host = host.split('.');
		if(config.reverse===true){
			host = reverse(host);
		}
		ns.s('HOST', host, true);
	}
	else{
		ns.s('HOST', [], true);
	}
	ns.s('host', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('hostEqual', function(h){
		return equal(ns, h, config.quiet);
	}, true);
	ns.s('hostLike', function(h){
		return like(ns, h, config.quiet);
	}, true);
	return Promise.resolve({host: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-host.auto', []);
	return Promise.resolve({host: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-host.done', []);
	return Promise.resolve({host: config.enable===true});
};
module.exports.done = done;

