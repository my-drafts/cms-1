'use strict';


var a = require('./../lib/actions');


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptEncoding init']);
	ns.ACCEPT_ENCODING = a.value2case(config, ns.request.headers['accept-encoding'], '*');
	Object.freeze(ns.ACCEPT_ENCODING);
	return Promise.resolve({ acceptEncoding: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptEncoding auto']);
	return Promise.resolve({ acceptEncoding: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['acceptEncoding done']);
	return Promise.resolve({acceptEncoding: config.enable===true});
};
module.exports.done = done;

