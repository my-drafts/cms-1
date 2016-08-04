'use strict';


// userAgent
//
// https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
//


var type = require('zanner-typeof'), of = type.of;


var init = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['userAgent init']);
	ns.USER_AGENT_STRING = '';
	let value = '';
	if(config.enable===true){
		let key = 'user-agent';
		value = ns.request.headers[key] || value;
		ns.USER_AGENT_STRING = value;
		switch(config.case){
			case 'lower':
				value = value.toLowerCase();
				break;
			case 'upper':
				value = value.toUpperCase();
				break;
		}
		if(value.match(/Firefox[\/][\.\d]+/i) && !value.match(/Seamonkey[\/][\.\d]+/i)){
			value = 'firefox';
		}
		else if(value.match(/Seamonkey[\/][\.\d]+/i)){
			value = 'seamonkey';
		}
		else if(value.match(/Chrome[\/][\.\d]+/i) && !value.match(/Chromium[\/][\.\d]+/i)){
			value = 'chrome';
		}
		else if(value.match(/Chromium[\/][\.\d]+/i)){
			value = 'chromium';
		}
		else if(value.match(/Safari[\/][\.\d]+/i) && !value.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)){
			value = 'safari';
		}
		else if(value.match(/(?:Opera|OPR)[\/][\.\d]+/i)){
			value = 'opera';
		}
		else if(value.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)){
			value = 'ie';
		}
		else{
			value = 'unknown';
		}
	}
	ns.USER_AGENT = value;
	Object.freeze(ns.USER_AGENT);
};
module.exports.init = init;


var get = function(ns){
	ns.log('TRACE', 'engine::meta', ['userAgent init']);
	ns.userAgent = function(){
		ns.log('DEBUG', 'engine::meta', ['call userAgent']);
		let result = ns.USER_AGENT;
		ns.log('DEBUG', 'engine::meta', ['called userAgent', result]);
		return result;
	};
	Object.freeze(ns.userAgent);
};
module.exports.userAgent = get;


var equal = function(ns){
	ns.log('TRACE', 'engine::meta', ['userAgentEqual init']);
	ns.userAgentEqual = function(ua){
		ns.log('DEBUG', 'engine::meta', ['call userAgentEqual', ua]);
		let result = ns.USER_AGENT===ua;
		ns.log('DEBUG', 'engine::meta', ['called userAgentEqual', result]);
		return result;
	};
	Object.freeze(ns.userAgentEqual);
};
module.exports.userAgentEqual = equal;


var like = function(ns){
	ns.log('TRACE', 'engine::meta', ['userAgentLike init']);
	ns.userAgentLike = function(ua){
		ns.log('DEBUG', 'engine::meta', ['call userAgentLike', ua]);
		let result = false;
		if(of(ua, 'array')){
			result = ua.some(function(item, index){
				return ns.userAgentLike(item);
			});
		}
		else if(of(ua, 'regex')){
			result = ua.test(ns.USER_AGENT);
		}
		else{
			result = ns.userAgentEqual(ua);
		}
		ns.log('DEBUG', 'engine::meta', ['called userAgentLike', result]);
		return result;
	};
	Object.freeze(ns.userAgentLike);
};
module.exports.userAgentLike = like;


var auto = function(ns, config){
	ns.log('TRACE', 'engine::meta', ['userAgentAuto init']);
	ns.userAgentAuto = function(options){
		ns.log('TRACE', 'engine::meta', ['call userAgentAuto']);
		options = Object.assign({}, config, options);
		return Promise.resolve(options.enable===true);
	};
	Object.freeze(ns.userAgentAuto);
};
module.exports.userAgentAuto = auto;

