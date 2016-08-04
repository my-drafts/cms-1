'use strict';


var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['call contentType']);
	let result = ns.CONTENT_TYPE;
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['called contentType', result]);
	return result;
};
var equal = function(ns, ct, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['call contentTypeEqual', ct]);
	let result = ns.CONTENT_TYPE===ct;
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['called contentTypeEqual', result]);
	return result;
};
var like = function(ns, ct, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['call contentTypeLike', ct]);
	let result = false;
	if(of(ct, 'array')){
		result = ct.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(ct, 'regex')){
		result = ct.test(ns.CONTENT_TYPE);
	}
	else{
		result = equal(ns, ct, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine::meta', ['called contentTypeLike', result]);
	return result;
};


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['contentType init']);
	ns.CONTENT_TYPE = a.value2case(config, ns.request.headers['content-type'], '-/-');
	ns.contentType = function(){
		return get(ns, false);
	};
	ns.contentTypeEqual = function(ct){
		return equal(ns, ct, false);
	};
	ns.contentTypeLike = function(ct){
		return like(ns, ct, false);
	};
	Object.freeze(ns.CONTENT_TYPE);
	Object.freeze(ns.contentType);
	Object.freeze(ns.contentTypeEqual);
	Object.freeze(ns.contentTypeLike);
	return Promise.resolve({ contentType: config.enable===true});
};
module.exports.init = init;

var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['contentTypeAuto init']);
	ns.contentTypeAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call contentTypeAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.contentTypeAuto);
};
module.exports.auto = auto;

