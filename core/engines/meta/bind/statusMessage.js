'use strict';


var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['statusMessage init']);
	let value = '';
	if(config.enable===true){
		let key = 'statusMessage';
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
	ns.STATUS_MESSAGE = value;
	Object.freeze(ns.STATUS_MESSAGE);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusMessage init']);
	ns.statusMessage = function(){
		ns.log('DEBUG', 'engine::meta', ['call statusMessage']);
		let result = ns.STATUS_MESSAGE;
		ns.log('DEBUG', 'engine::meta', ['called statusMessage', result]);
		return result;
	};
	Object.freeze(ns.statusMessage);
};
module.exports.statusMessage = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusMessageEqual init']);
	ns.statusMessageEqual = function(sm){
		ns.log('DEBUG', 'engine::meta', ['call statusMessageEqual', sm]);
		let result = ns.STATUS_MESSAGE===sm;
		ns.log('DEBUG', 'engine::meta', ['called statusMessageEqual', result]);
		return result;
	};
	Object.freeze(ns.statusMessageEqual);
};
module.exports.statusMessageEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['statusMessageLike init']);
	ns.statusMessageLike = function(sm){
		ns.log('DEBUG', 'engine::meta', ['call statusMessageLike', sm]);
		let result = false;
		if(of(sm, 'array')){
			result = sm.some(function(item, index){
				return ns.statusMessageLike(item);
			});
		}
		else if(of(sm, 'regex')){
			result = sm.test(ns.STATUS_MESSAGE);
		}
		else{
			result = ns.statusMessageEqual(sm);
		}
		ns.log('DEBUG', 'engine::meta', ['called statusMessageLike', result]);
		return result;
	};
	Object.freeze(ns.statusMessageLike);
};
module.exports.statusMessageLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['statusMessageAuto init']);
	ns.statusMessageAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call statusMessageAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.statusMessageAuto);
};
module.exports.statusMessageAuto = auto;

