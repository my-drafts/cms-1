'use strict';


var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['port init']);
	let value = 0;
	if(config.enable===true){
		let RE = /^(?:[^\:]*?[\:][^\@]*?[\@])?(.*?)(?:[\:]([\d]+))?$/i;
		let key = 'port';
		value = ns.request.headers[key] || '';
		value = value.replace(RE, '$2');
		value = Number(value) || 0;
	}
	ns.PORT = value;
	Object.freeze(ns.PORT);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['port init']);
	ns.port = function(){
		ns.log('DEBUG', 'engine::meta', ['call port']);
		let result = ns.PORT;
		ns.log('DEBUG', 'engine::meta', ['called port', result]);
		return result;
	};
	Object.freeze(ns.port);
};
module.exports.port = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['portEqual init']);
	ns.portEqual = function(p){
		ns.log('DEBUG', 'engine::meta', ['call portEqual', p]);
		let result = false;
		if(of(p, 'number')){
			result = ns.PORT===p;
		}
		else if(of(p, 'string')){
			result = ns.PORT==p;
		}
		ns.log('DEBUG', 'engine::meta', ['called portEqual', result]);
		return result;
	};
	Object.freeze(ns.portEqual);
};
module.exports.portEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['portLike init']);
	ns.portLike = function(p){
		ns.log('DEBUG', 'engine::meta', ['call portLike', p]);
		let result = false;
		if(of(p, 'array')){
			result = p.some(function(item, index){
				return ns.portLike(item);
			});
		}
		else if(of(p, 'regex')){
			result = p.test(ns.PORT);
		}
		else{
			result = ns.portEqual(p);
		}
		ns.log('DEBUG', 'engine::meta', ['called portLike', result]);
		return result;
	};
	Object.freeze(ns.portLike);
};
module.exports.portLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['portAuto init']);
	ns.portAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call portAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.portAuto);
};
module.exports.portAuto = auto;
