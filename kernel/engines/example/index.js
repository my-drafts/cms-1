'use strict';


var config = require('./config');


var init = function(ns){
	ns.log('TRACE', 'engine.example.init', []);
	return Promise.resolve({example: config.enable===true});
};
module.exports.init = init;


var auto = function(ns){
	ns.log('TRACE', 'engine.example.auto', []);
	return Promise.resolve({example: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns){
	ns.log('TRACE', 'engine.example.done', []);
	return Promise.resolve({example: config.enable===true});
};
module.exports.done = done;


