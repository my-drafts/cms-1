'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.get', ['call']);
	let result = ns.g('STATUS_MESSAGE');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.get', ['called', result]);
	return result;
};
var equal = function(ns, sm, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.equal', ['call', sm]);
	let result = get(ns, true)===sm;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.equal', ['called', result]);
	return result;
};
var like = function(ns, sm, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.like', ['call', sm]);
	let result = false;
	if(of(sm, 'array')){
		result = sm.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(sm, 'regexp')){
		result = sm.test(get(ns, true));
	}
	else{
		result = equal(ns, sm, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-statusMessage.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusMessage.init', []);
	ns.s('STATUS_MESSAGE', a.value2case(config, ns.request['statusMessage'], ''), true);
	ns.s('statusMessage', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('statusMessageEqual', function(sm){
		return equal(ns, sm, config.quiet);
	}, true);
	ns.s('statusMessageLike', function(sm){
		return like(ns, sm, config.quiet);
	}, true);
	return Promise.resolve({statusMessage: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusMessage.auto', []);
	return Promise.resolve({statusMessage: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-statusMessage.done', []);
	return Promise.resolve({statusMessage: config.enable===true});
};
module.exports.done = done;

