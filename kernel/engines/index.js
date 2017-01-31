'use strict';


var config = require('./config.json');
var type = require('zanner-typeof'), of = type.of, is = type.is;
var uf = require('util').format;


var enginesFilter = function(engine){
	return engine && engine.enable===true;
};
var enginesMap = function(engine){
	return [require(engine.path), engine.name];
};
var engines = config.engines.filter(enginesFilter).map(enginesMap);
var engineMap = function(ns, property){
	return function(engine){
		let engineRequire = engine[0],  engineName = engine[1];
		return engineRequire[property](ns);
	}
};
var engineSuccess = function(ns, property){
	return function(result){
		ns.log('TRACE', uf('engines.%s', property), ['success'].concat(result));
		return result;
	}
};
var engineUnsuccess = function(ns, property){
	return function(error){
		ns.log('ERROR', uf('engines.%s', property), ['unsuccess'].concat(error));
		return error;
	}
};


var init = function(ns){
	ns.log('TRACE', 'engines.init', []);
	let map = engineMap(ns, 'init');
	let success = engineSuccess(ns, 'init');
	let unsuccess = engineUnsuccess(ns, 'init');
	let promises = engines.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.init = init;


var auto = function(ns){
	ns.log('TRACE', 'engines.auto', []);
	let map = engineMap(ns, 'auto');
	let success = engineSuccess(ns, 'auto');
	let unsuccess = engineUnsuccess(ns, 'auto');
	let promises = engines.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.auto = auto;


var done = function(ns){
	ns.log('TRACE', 'engines.done', []);
	let map = engineMap(ns, 'done');
	let success = engineSuccess(ns, 'done');
	let unsuccess = engineUnsuccess(ns, 'done');
	let promises = engines.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.done = done;


var handler = function(ns, router){
	ns.log('TRACE', 'engines.handler', [ns.request.url]);
	return Promise.resolve({})
		.then(function(){
			ns.log('DEBUG', 'engines.handler-init', []);
			return init(ns);
		})
		.then(function(inited){
			ns.log('DEBUG', 'engine.handler-auto', []);
			return auto(ns);
		})
		.then(function(autoed){
			ns.log('DEBUG', 'engine.handler-router', []);
			return of(router, 'promise', 1) ? router : Promise.resolve(router(ns));
		})
		.then(function(routed){
			ns.log('DEBUG', 'engine.handler-done', []);
			return done(ns);
		})
		.then(function(doneed){
			ns.log('DEBUG', 'engine.handler-then', []);
			return undefined;
		});
};
module.exports.handler = handler;

