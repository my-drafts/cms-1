'use strict';


var a = require('../lib/actions');


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-accept.init', []);
	ns.s('ACCEPT', a.value2case(config, ns.request.headers['accept'], '*/*'), true);
	return Promise.resolve({accept: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-accept.auto', []);
	return Promise.resolve({accept: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-accept.done', []);
	return Promise.resolve({accept: config.enable===true});
};
module.exports.done = done;

