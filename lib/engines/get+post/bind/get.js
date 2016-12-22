'use strict';


var a = require('../lib/actions');
var get_form_urlencoded = require('../lib/get/form_urlencoded');


// get
//
// {
//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
//   'fieldName2': [ ... ],
//   ...
// }
//
var getKeys = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getKeys', ['call']);
	let result = a.akeys(ns.g('GET'));
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getKeys', ['called', result]);
	return result;
};
var getAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getAmount', ['call', name]);
	let result = a.alength(ns.g('GET'), name);
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getAmount', ['called', result]);
	return result;
};
var get = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.get.get', ['call', name, index]);
	let result = a.aitem(ns.g('GET'), name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.get.get', ['called', result]);
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
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getObjects', ['call']);
	let result = a.awalk(ns.g('GET'), getObjectsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine.get.getObjects', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.get.init', []);
	ns.s('GET', {}, false);
	ns.s('getKeys', function(){
		return getKeys(ns, config.quiet);
	}, true);
	ns.s('getAmount', function(name){
		return getAmount(ns, name, config.quiet);
	}, true);
	ns.s('get', function(name, index){
		return get(ns, name, index, config.quiet);
	}, true);
	ns.s('getObjects', function(){
		return getObjects(ns, config.quiet);
	}, true);
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
	config.quiet ? 0 : ns.log('TRACE', 'engine.get.auto', []);
	let loaded = undefined;
	let al = autoLoading(ns, config);
	let loading = al.loading, loadingOptions = al.loadingOptions;
	if(config.enable!==true){
		config.quiet ? 0 : ns.log('DEBUG', 'engine.get.auto', ['disabled']);
		return Promise.resolve({get: false});
	}
	else if(loaded){
		config.quiet ? 0 : ns.log('DEBUG', 'engine.get.auto', ['from loaded', loaded]);
		return Promise.resolve({get: loaded>0});
	}
	else{
		config.quiet ? 0 : ns.log('DEBUG', 'engine.get.auto', ['enable']);
		let options = Object.assign({}, config['*/*'], loadingOptions);
		return loading(ns, options)
			.then(function(result){
				config.quiet ? 0 : ns.log('DEBUG', 'engine.get.auto', ['successes']);
				ns.f('GET');
				loaded = 1;
				return {get: true};
			})
			.catch(function(error){
				config.quiet ? 0 : ns.log('ERROR', 'engine.get.auto', ['unsuccesses', error]);
				ns.f('GET');
				loaded = -1;
				return error;
			});
	}
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.get.done', []);
	return Promise.resolve({get: config.enable===true});
};
module.exports.done = done;

