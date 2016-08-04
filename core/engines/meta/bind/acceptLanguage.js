'use strict';


var a = require('./../lib/actions');


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptLanguage init']);
	ns.ACCEPT_LANGUAGE = a.value2case(config, ns.request.headers['accept-language'], '*');
	Object.freeze(ns.ACCEPT_LANGUAGE);
	return Promise.resolve({ acceptLanguage: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptLanguage auto']);
	return Promise.resolve({ acceptLanguage: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptLanguage done']);
	return Promise.resolve({acceptLanguage: config.enable===true});
};
module.exports.done = done;

