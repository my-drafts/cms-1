'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.get', ['call']);
	let result = ns.g('METHOD');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.get', ['called', result]);
	return result;
};
var equal = function(ns, m, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.equal', ['call', m]);
	let result = get(ns, true)===m;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.equal', ['called', result]);
	return result;
};
var like = function(ns, m, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.like', ['call', m]);
	let result = false;
	if(of(m, 'array')){
		result = m.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(m, 'regexp')){
		result = m.test(get(ns, true));
	}
	else{
		result = equal(ns, m, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-method.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-method.init', []);
	ns.s('METHOD', a.value2case(config, ns.request['method'], ''), true);
	ns.s('method', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('methodEqual', function(m){
		return equal(ns, m, config.quiet);
	}, true);
	ns.s('methodLike', function(m){
		return like(ns, m, config.quiet);
	}, true);
	return Promise.resolve({method: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-method.auto', []);
	return Promise.resolve({method: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-method.done', []);
	return Promise.resolve({method: config.enable===true});
};
module.exports.done = done;

