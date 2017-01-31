'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.get', ['call']);
	let result = ns.g('STATUS_CODE');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.get', ['called', result]);
	return result;
};
var equal = function(ns, sc, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.equal', ['call', sc]);
	let result = false;
	if(of(sc, 'number')){
		result = get(ns, true)===sc;
	}
	else if(of(sc, 'string')){
		result = get(ns, true)==sc;
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.equal', ['called', result]);
	return result;
};
var like = function(ns, sc, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.like', ['call', sc]);
	let result = false;
	if(of(sc, 'array')){
		result = sc.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(sc, 'regexp')){
		result = sc.test(get(ns, true));
	}
	else{
		result = equal(ns, sc, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusCode.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusCode.init', []);
	if(config.enable===true){
		let code = ns.request['statusCode'] || 0;
		ns.s('STATUS_CODE', code, true);
	}
	else{
		ns.s('STATUS_CODE', 0, true);
	}
	ns.s('statusCode', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('statusCodeEqual', function(sc){
		return equal(ns, sc, config.quiet);
	}, true);
	ns.s('statusCodeLike', function(sc){
		return like(ns, sc, config.quiet);
	}, true);
	return Promise.resolve({statusCode: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusCode.auto', []);
	return Promise.resolve({statusCode: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusCode.done', []);
	return Promise.resolve({statusCode: config.enable===true});
};
module.exports.done = done;

