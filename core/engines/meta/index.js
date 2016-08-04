'use strict';


var config = require('./config');


var binds = [
	[require('./bind/accept'), 'accept'],
	[require('./bind/acceptEncoding'), 'acceptEncoding'],
	[require('./bind/acceptLanguage'), 'acceptLanguage'],
	[require('./bind/contentType'), 'contentType'],
	[require('./bind/cookie'), 'cookie'],
	[require('./bind/host'), 'host'],
	[require('./bind/method'), 'method'],
	[require('./bind/path'), 'path'],
	[require('./bind/port'), 'port'],
	[require('./bind/session'), 'session'],
	[require('./bind/statusCode'), 'statusCode'],
	[require('./bind/statusMessage'), 'statusMessage'],
	[require('./bind/userAgent'), 'userAgent']
];


var bindMap = function(property){
	return function(bind){
		return bind[0][property](ns, config[bind[1]]);
	}
};
var bindSuccess = function(bind){
	return function(result){
		ns.log('TRACE', 'engine::meta '+bind+' success', [result]);
		return result;
	}
};
var bindUnsuccess = function(bind){
	return function(error){
		let msg = 'engine::meta '+bind+' unsuccess';
		ns.log('ERROR', msg, [error]);
		return msg+': '+error;
	}
};


var init = function(ns){
	ns.log('TRACE', 'engine::meta', ['init']);
	let map = bindMap('init');
	let success = bindSuccess('init');
	let unseccess = bindUnsuccess('init');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports.init = init;


var auto = function(ns){
	ns.log('TRACE', 'engine::meta', ['auto']);
	let map = bindMap('auto');
	let success = bindSuccess('auto');
	let unseccess = bindUnsuccess('auto');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports.auto = auto;


var done = function(ns){
	// ???
	// ns.sessionDone();
	// ns.cookieSetSend();
	//
	ns.log('TRACE', 'engine::meta', ['done']);
	let map = bindMap('done');
	let success = bindSuccess('done');
	let unseccess = bindUnsuccess('done');
	return Promise.all(binds.map(map)).then(success, unseccess);
};
module.exports.init = done;

