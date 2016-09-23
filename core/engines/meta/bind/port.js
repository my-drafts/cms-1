'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.get', ['call']);
	let result = ns.g('PORT');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.get', ['called', result]);
	return result;
};
var equal = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.equal', ['call', p]);
	let result = false;
	if(of(p, 'number')){
		result = get(ns, true)===p;
	}
	else if(of(p, 'string')){
		result = get(ns, true)==p;
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.equal', ['called', result]);
	return result;
};
var like = function(ns, p, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.like', ['call', p]);
	let result = false;
	if(of(p, 'array')){
		result = p.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(p, 'regexp')){
		result = p.test(get(ns, true));
	}
	else{
		result = equal(ns, p, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-port.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-port.init', []);
	if(config.enable===true){
		let RE = /^(?:[^\:]*?[\:][^\@]*?[\@])?(.*?)(?:[\:]([\d]+))?$/i;
		let port = ns.request.headers['port'] || '';
		port = port.replace(RE, '$2');
		port = Number(port) || 0;
		ns.s('PORT', port, true);
	}
	else{
		ns.s('PORT', 0, true);
	}
	ns.s('port', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('portEqual', function(p){
		return equal(ns, p, config.quiet);
	}, true);
	ns.s('portLike', function(p){
		return like(ns, p, config.quiet);
	}, true);
	return Promise.resolve({port: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-port.auto', []);
	return Promise.resolve({port: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-port.done', []);
	return Promise.resolve({port: config.enable===true});
};
module.exports.done = done;

