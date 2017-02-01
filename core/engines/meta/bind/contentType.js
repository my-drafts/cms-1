'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.get', ['call']);
	let result = ns.g('CONTENT_TYPE');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.get', ['called', result]);
	return result;
};
var equal = function(ns, ct, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.equal', ['call', ct]);
	let result = get(ns, true)===ct;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.equal', ['called', result]);
	return result;
};
var like = function(ns, ct, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.like', ['call', ct]);
	let result = false;
	if(of(ct, 'array')){
		result = ct.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(ct, 'regexp')){
		result = ct.test(get(ns, true));
	}
	else{
		result = equal(ns, ct, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-contentType.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-contentType.init', []);
	ns.s('CONTENT_TYPE', a.value2case(config, ns.request.headers['content-type'], '-/-'), true);
	ns.s('contentType', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('contentTypeEqual', function(ct){
		return equal(ns, ct, config.quiet);
	}, true);
	ns.s('contentTypeLike', function(ct){
		return like(ns, ct, config.quiet);
	}, true);
	return Promise.resolve({contentType: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-contentType.auto', []);
	return Promise.resolve({contentType: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-contentType.done', []);
	return Promise.resolve({contentType: config.enable===true});
};
module.exports.done = done;

