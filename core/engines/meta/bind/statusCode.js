'use strict';


var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['statusCode init']);
	let value = 0;
	if(config.enable===true){
		let key = 'statusCode';
		value = ns.request[key] || value;
	}
	ns.STATUS_CODE = value;
	Object.freeze(ns.STATUS_CODE);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusCode init']);
	ns.statusCode = function(){
		ns.log('DEBUG', 'engine::meta', ['call statusCode']);
		let result = ns.STATUS_CODE;
		ns.log('DEBUG', 'engine::meta', ['called statusCode', result]);
		return result;
	};
	Object.freeze(ns.statusCode);
};
module.exports.statusCode = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusCodeEqual init']);
	ns.statusCodeEqual = function(sc){
		ns.log('DEBUG', 'engine::meta', ['call statusCodeEqual', sc]);
		let result = false;
		if(of(sc, 'number')){
			result = ns.STATUS_CODE===sc;
		}
		else if(of(sc, 'string')){
			result = ns.STATUS_CODE==sc;
		}
		ns.log('DEBUG', 'engine::meta', ['called statusCodeEqual', result]);
		return result;
	};
	Object.freeze(ns.statusCodeEqual);
};
module.exports.statusCodeEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusCodeLike init']);
	ns.statusCodeLike = function(sc){
		ns.log('DEBUG', 'engine::meta', ['call statusCodeLike', sc]);
		let result = false;
		if(of(sc, 'array')){
			result = sc.some(function(item, index){
				return ns.statusCodeLike(item);
			});
		}
		else if(of(sc, 'regex')){
			result = sc.test(ns.STATUS_CODE);
		}
		else{
			result = ns.statusCodeEqual(sc);
		}
		ns.log('DEBUG', 'engine::meta', ['called statusCodeLike', result]);
		return result;
	};
	Object.freeze(ns.statusCodeLike);
};
module.exports.statusCodeLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['statusCodeAuto init']);
	ns.statusCodeAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call statusCodeAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.statusCodeAuto);
};
module.exports.statusCodeAuto = auto;

