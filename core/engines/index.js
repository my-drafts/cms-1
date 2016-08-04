'use strict';


var engines = [
	[require('./example/index'), 'example'],
//	[require('./get+post'), 'get+post'],
	[require('./meta/index'), 'meta']
];


var engineMap = function(property){
	return function(engine){
		return engine[0][property](ns);
	}
};
var engineSuccess = function(engine){
	return function(result){
		ns.log('TRACE', 'engines ' + engine + ' success', [result]);
		return result;
	}
};
var engineUnsuccess = function(engine){
	return function(error){
		let msg = 'engines ' + engine + ' unsuccess';
		ns.log('ERROR', msg, [error]);
		return msg + ': ' + error;
	}
};


var init = function(ns){
	ns.log('TRACE', 'engines', ['init']);
	let map = engineMap('init');
	let success = engineSuccess('init');
	let unseccess = engineUnsuccess('init');
	return Promise.all(engines.map(map)).then(success, unseccess);
};
module.exports.init = init;


var auto = function(ns){
	ns.log('TRACE', 'engines', ['auto']);
	let map = engineMap('auto');
	let success = engineSuccess('auto');
	let unseccess = engineUnsuccess('auto');
	return Promise.all(engines.map(map)).then(success, unseccess);
};
module.exports.auto = auto;


var done = function(ns){
	ns.log('TRACE', 'engines', ['done']);
	let map = engineMap('done');
	let success = engineSuccess('done');
	let unseccess = engineUnsuccess('done');
	return Promise.all(engines.map(map)).then(success, unseccess);
};
module.exports.done = done;

