'use strict';


var a = require('../lib/actions');


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-acceptLanguage.init', []);
	ns.s('ACCEPT_LANGUAGE', a.value2case(config, ns.request.headers['accept-language'], '*'), true);
	return Promise.resolve({acceptLanguage: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-acceptLanguage.auto', []);
	return Promise.resolve({acceptLanguage: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-acceptLanguage.done', []);
	return Promise.resolve({acceptLanguage: config.enable===true});
};
module.exports.done = done;

