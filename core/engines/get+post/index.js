'use strict';


var config = require('./config');


var binds = [
	[require('./bind/get'), 'get'],
	[require('./bind/post'), 'post']
];


var bindMap = function(property){
	return function(bind){
		return bind[0][property](ns, config[bind[1]]);
	}
};
var bindSuccess = function(bind){
	return function(result){
		ns.log('TRACE', 'engine::get+post '+bind+' success', [result]);
		return result;
	}
};
var bindUnsuccess = function(bind){
	return function(error){
		let msg = 'engine::get+post '+bind+' unsuccess';
		ns.log('ERROR', msg, [error]);
		return msg+': '+error;
	}
};


var init = function(ns){
	ns.log('TRACE', 'engine::get+post', ['init']);
	let map = bindMap('init');
	let success = bindSuccess('init');
	let unseccess = bindUnsuccess('init');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports = init;


var auto = function(ns){
	ns.log('TRACE', 'engine::get+post', ['auto']);
	let map = bindMap('auto');
	let success = bindSuccess('auto');
	let unseccess = bindUnsuccess('auto');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports.auto = auto;


var done = function(ns){
	ns.log('TRACE', 'engine::get+post', ['done']);
	let map = bindMap('done');
	let success = bindSuccess('done');
	let unseccess = bindUnsuccess('done');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports.init = done;

