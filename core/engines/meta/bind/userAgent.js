'use strict';


var a = require('../lib/actions');
var type = require('zanner-typeof'), of = type.of;


// userAgent
//
// https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
//
var userAgent2Browser = function(value){
	let CFG = [
		{name: 'firefox', like: [/Firefox[\/][\.\d]+/i], unlike: [/Seamonkey[\/][\.\d]+/i]},
		{name: 'seamonkey', like: [/Seamonkey[\/][\.\d]+/i]},
		{name: 'chrome', like: [/Chrome[\/][\.\d]+/i], unlike: [/Chromium[\/][\.\d]+/i]},
		{name: 'chromium', like: [/Chromium[\/][\.\d]+/i]},
		{name: 'safari', like: [/Safari[\/][\.\d]+/i], unlike: [/(?:Chrome|Chromium)[\/][\.\d]+/i]},
		{name: 'opera', like: [/(?:Opera|OPR)[\/][\.\d]+/i]},
		{name: 'ie', like: [/[\;]MSIE[\s]*[\.\d]+[\;]/i]},
		{name: 'unknown'}
	];
	let check = function(value, RE, unlike){
		let someCheck = function(re, index){
			let result = of(re, 'regexp') ? re.test(value) : undefined;
			return result===undefined ? false : unlike ? result : !result;
		};
		return of(RE, 'array') ? !RE.some(someCheck) : true;
	};
	let result = CFG.find(function(cfg, index){
		return check(value, cfg.like, false) && check(value, cfg.unlike, true);
	});
	return result.name;
};
var get = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.get', ['call']);
	let result = ns.g('USER_AGENT');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.get', ['called', result]);
	return result;
};
var equal = function(ns, ua, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.equal', ['call', ua]);
	let result = get(ns, true)===ua;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.equal', ['called', result]);
	return result;
};
var like = function(ns, ua, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.like', ['call', ua]);
	let result = false;
	if(of(ua, 'array')){
		result = ua.some(function(item, index){
			return like(ns, item, true);
		});
	}
	else if(of(ua, 'regexp')){
		result = ua.test(get(ns, true));
	}
	else{
		result = equal(ns, ua, true);
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.like', ['called', result]);
	return result;
};
var browser = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.browser', ['call']);
	let result = ns.g('BROWSER');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-userAgent.browser', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-userAgent.init', []);
	ns.s('USER_AGENT', a.value2case(config, ns.request.headers['user-agent'], ''), true);
	ns.s('BROWSER', userAgent2Browser(ns.USER_AGENT), true);
	ns.s('userAgent', function(){
		return get(ns, config.quiet);
	}, true);
	ns.s('userAgentEqual', function(ua){
		return equal(ns, ua, config.quiet);
	}, true);
	ns.s('userAgentLike', function(ua){
		return like(ns, ua, config.quiet);
	}, true);
	ns.s('browser', function(ua){
		return browser(ns, config.quiet);
	}, true);
	return Promise.resolve({userAgent: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-userAgent.auto', []);
	return Promise.resolve({userAgent: config.enable===true});
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-userAgent.done', []);
	return Promise.resolve({userAgent: config.enable===true});
};
module.exports.done = done;

