'use strict';


var a = require('../lib/actions');
var url = require('url');
var type = require('zanner-typeof'), of = type.of;


// path
//
// [ 'dir1', ... ]
//
var pathJoin = function(path, first){
	return (first ? '/' : '') + path.join('/');
};
var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.get', ['call']);
	let result = pathJoin(ns.g('PATH'), true);
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.get', ['called', result]);
	return result;
};
var equal = function(ns, p, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.equal', ['call', p]);
	let result = false;
	if(of(p, 'array')){
		result = get(ns, true)===pathJoin(p, true);
	}
	else if(of(p, 'string')){
		result = equal(ns, p.replace(/^[\/]?(.*?)[\/]?$/, '$1').split('/'), true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.equal', ['called', result]);
	return result;
};
var like = function(ns, p, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.like', ['call', p]);
	let result = false;
	if(of(p, 'array')){
		result = like(ns, pathJoin(p.sort(), true), true);
	}
	else if(of(p, 'regexp')){
		result = p.test(get(ns, true));
	}
	else if(of(p, 'string')){
		result = pathJoin(ns.g('PATH').sort(), true)===pathJoin(p.replace(/^[\/]?(.*?)[\/]?$/, '$1').split('/').sort(), true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-path.like', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-path.init', []);
	if(config.enable===true){
		let RE = /^[\/]?(.*?)[\/]?$/;
		let path = a.value2case(config, ns.request['url'], '');
		path = url.parse(path, true).pathname;
		path = path.replace(RE, '$1');
		path = path.split('/');
		ns.s('PATH', path, true);
	}
	else{
		ns.s('PATH', [], true);
	}
	ns.s('path', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('pathEqual', function(p){
		return equal(ns, p, config.quiet);
	}, true);
	ns.s('pathLike', function(p){
		return like(ns, p, config.quiet);
	}, true);
	return Promise.resolve({path: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-path.auto', []);
	return Promise.resolve({path: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-path.done', []);
	return Promise.resolve({path: config.enable===true});
};
module.exports.done = done;

