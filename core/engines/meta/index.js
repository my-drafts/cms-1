'use strict';


var config = require('./config');
var uf = require('util').format;


var bindsFilter = function(bind){
	return bind && bind.enable===true;
};
var bindsMap = function(bind){
	return [require(bind.path), bind.name];
};
var binds = config.binds.filter(bindsFilter).map(bindsMap);
var bindMap = function(ns, property){
	return function(bind){
		let bindRequire = bind[0], bindName = bind[1];
		return bindRequire[property](ns, config[bindName]);
	}
};
var bindSuccess = function(ns, property){
	return function(result){
		ns.log('TRACE', uf('engine.meta.%s', property), ['success'].concat(result));
		return result;
	}
};
var bindUnsuccess = function(ns, property){
	return function(error){
		let msg = uf('engine.meta.%s', property);
		ns.log('ERROR', msg, ['unsuccess', error]);
		return uf('%s unsuccess: %j', msg, error);
	}
};


var init = function(ns){
	ns.log('TRACE', 'engine.meta.init', []);
	let map = bindMap(ns, 'init');
	let success = bindSuccess(ns, 'init');
	let unsuccess = bindUnsuccess(ns, 'init');
	let promises = binds.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.init = init;


var auto = function(ns){
	ns.log('TRACE', 'engine.meta.auto', []);
	let map = bindMap(ns, 'auto');
	let success = bindSuccess(ns, 'auto');
	let unsuccess = bindUnsuccess(ns, 'auto');
	let promises = binds.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.auto = auto;


var done = function(ns){
	ns.log('TRACE', 'engine.meta.done', []);
	let map = bindMap(ns, 'done');
	let success = bindSuccess(ns, 'done');
	let unsuccess = bindUnsuccess(ns, 'done');
	let promises = binds.map(map);
	return Promise.all(promises).then(success, unsuccess);
};
module.exports.done = done;

