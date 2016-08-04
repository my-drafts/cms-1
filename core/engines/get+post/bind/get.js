'use strict';


var a = require('./../lib/actions');
var get_form_urlencoded = require('./../lib/get/form_urlencoded');


// get
//
// {
//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
//   'fieldName2': [ ... ],
//   ...
// }
//
var getKeys = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['call gets']);
	let result = a.akeys(ns.GET);
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['called gets', result]);
	return result;
};
var getAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['call getAmount', name]);
	let result = a.alength(ns.GET, name);
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['called getAmount', result]);
	return result;
};
var get = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['call get', name, index]);
	let result = a.aitem(ns.GET, name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['called get', result]);
	return result;
};
var getObjectsWalk = function(item, index, field){
	return {
		field: field,
		value: item,
		index: index
	};
};
var getObjects = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['call getObjects']);
	let result = a.awalk(ns.GET, getObjectsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine::get', ['called getObjects', result]);
	return result;
};


var init = function(ns, config){
	ns.log('TRACE', 'engine::get', ['init']);
	ns.GET = {};
	ns.getKeys = function(){
		return getKeys(ns, config.quiet);
	};
	ns.getAmount = function(name){
		return getAmount(ns, name, config.quiet);
	};
	ns.get = function(name, index){
		return get(ns, name, index, config.quiet);
	};
	ns.getObjects = function(){
		return getObjects(ns, config.quiet);
	};
	Object.freeze(ns.gets);
	Object.freeze(ns.getAmount);
	Object.freeze(ns.get);
	Object.freeze(ns.getObjects);
	return Promise.resolve({get: config.enable===true});
};
module.exports.init = init;


var autoLoading = function(ns, config){
	return {
		loading: get_form_urlencoded,
		loadingOptions: config['get/form-urlencoded']
	};
};
var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine::get', ['auto']);
	let loaded = undefined;
	let al = autoLoading(ns, config);
	let loading = al.loading, loadingOptions = al.loadingOptions;
	if(config.enable!==true){
		config.quiet ? 0 : ns.log('DEBUG', 'engine::get', ['auto disabled']);
		return Promise.resolve({get: false});
	}
	else if(loaded){
		config.quiet ? 0 : ns.log('DEBUG', 'engine::get', ['auto from loaded', loaded]);
		return Promise.resolve({get: loaded>0});
	}
	else{
		config.quiet ? 0 : ns.log('DEBUG', 'engine::get', ['auto enable']);
		let options = Object.assign({}, config['*/*'], loadingOptions);
		return loading(ns, options)
			.then(function(result){
				config.quiet ? 0 : ns.log('DEBUG', 'engine::get', ['auto successes']);
				Object.freeze(ns.GET);
				loaded = 1;
				return {get: true};
			})
			.catch(function(error){
				config.quiet ? 0 : ns.log('ERROR', 'engine::get', ['auto unsuccesses', error]);
				Object.freeze(ns.GET);
				loaded = -1;
				return error;
			});
	}
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine::get', ['done']);
	return Promise.resolve({get: config.enable===true});
};
module.exports.done = done;

