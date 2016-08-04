'use strict';


// path
//
// [ 'dir1', ... ]
//


var url = require('url');
var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['path init']);
	let value = [];
	if(config.enable===true){
		let RE = /^[\/]?(.*?)[\/]?$/;
		let key = 'url';
		value = ns.request[key] || '';
		switch(config.case){
			case 'lower':
				value = value.toLowerCase();
				break;
			case 'upper':
				value = value.toUpperCase();
				break;
		}
		value = url.parse(value, true).pathname;
		value = value.replace(RE, '$1');
		value = value.split('/');
	}
	ns.PATH = value;
	Object.freeze(ns.PATH);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['path init']);
	ns.path = function(){
		ns.log('DEBUG', 'engine::meta', ['call path']);
		let result = '/'+ns.PATH.join('/');
		ns.log('DEBUG', 'engine::meta', ['called path', result]);
		return result;
	};
	Object.freeze(ns.path);
};
module.exports.path = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['pathEqual init']);
	ns.pathEqual = function(p){
		ns.log('DEBUG', 'engine::meta', ['call pathEqual', p]);
		let result = false;
		if(of(p, 'string')){
			result = ns.PATH.join('/')===p.replace(/^[\/]?(.*?)[\/]?$/, '$1');
		}
		else if(of(p, 'array')){
			result = ns.pathEqual(p.join('/'));
		}
		ns.log('DEBUG', 'engine::meta', ['called pathEqual', result]);
		return result;
	};
	Object.freeze(ns.pathEqual);
};
module.exports.pathEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['pathLike init']);
	ns.pathLike = function(p){
		ns.log('DEBUG', 'engine::meta', ['call pathLike', p]);
		let result = false;
		if(of(p, 'array')){
			result = ns.pathLike(p.sort().join('/'));
		}
		else if(of(p, 'regex')){
			result = p.test(ns.PATH.join('/'));
		}
		else if(of(p, 'string')){
			result = ns.PATH.sort().join('/')===p.replace(/^[\/]?(.*?)[\/]?$/, '$1').split('/').sort().join('/');
		}
		ns.log('DEBUG', 'engine::meta', ['called pathLike', result]);
		return result;
	};
	Object.freeze(ns.pathLike);
};
module.exports.pathLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['pathAuto init']);
	ns.pathAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call pathAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.pathAuto);
};
module.exports.pathAuto = auto;
