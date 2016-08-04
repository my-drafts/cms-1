'use strict';


var init = function(ns){
	return Promise.resolve([{ 'example': true }]);
};
module.exports.init = init;


var auto = function(ns){
	return Promise.resolve([{ 'example': true }]);
};
module.exports.auto = auto;


var done = function(ns){
	return Promise.resolve([{ 'example': true }]);
};
module.exports.done = done;


