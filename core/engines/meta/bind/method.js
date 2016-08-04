'use strict';


var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['method init']);
	let value = '';
	if(config.enable===true){
		let key = 'method';
		value = ns.request[key] || value;
		switch(config.case){
			case 'lower':
				value = value.toLowerCase();
				break;
			case 'upper':
				value = value.toUpperCase();
				break;
		}
	}
	ns.METHOD = value;
	Object.freeze(ns.METHOD);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['method init']);
	ns.method = function(){
		ns.log('DEBUG', 'engine::meta', ['call method']);
		let result = ns.METHOD;
		ns.log('DEBUG', 'engine::meta', ['called method', result]);
		return result;
	};
	Object.freeze(ns.method);
};
module.exports.method = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['methodEqual init']);
	ns.methodEqual = function(m){
		ns.log('DEBUG', 'engine::meta', ['call methodEqual', m]);
		let result = ns.METHOD===m.toLowerCase();
		ns.log('DEBUG', 'engine::meta', ['called methodEqual', result]);
		return result;
	};
	Object.freeze(ns.methodEqual);
};
module.exports.methodEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['methodLike init']);
	ns.methodLike = function(m){
		ns.log('DEBUG', 'engine::meta', ['call methodLike', m]);
		let result = false;
		if(of(m, 'array')){
			result = m.some(function(item, index){
				return ns.methodLike(item);
			});
		}
		else if(of(m, 'regex')){
			result = m.test(ns.METHOD);
		}
		else{
			result = ns.methodEqual(m);
		}
		ns.log('DEBUG', 'engine::meta', ['called methodLike', result]);
		return result;
	};
	Object.freeze(ns.methodLike);
};
module.exports.methodLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['methodAuto init']);
	ns.methodAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call methodAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.methodAuto);
};
module.exports.methodAuto = auto;

