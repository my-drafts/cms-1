'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaUserAgent']);

			// userAgent
			//
			// https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
			//
			var USER_AGENT = (ns.request.headers['user-agent'] || '');
			if (USER_AGENT.match(/Firefox[\/][\.\d]+/i) && !USER_AGENT.match(/Seamonkey[\/][\.\d]+/i)) {
				USER_AGENT = 'firefox';
			}
			else if (USER_AGENT.match(/Seamonkey[\/][\.\d]+/i)) {
				USER_AGENT = 'seamonkey';
			}
			else if (USER_AGENT.match(/Chrome[\/][\.\d]+/i) && !USER_AGENT.match(/Chromium[\/][\.\d]+/i)) {
				USER_AGENT = 'chrome';
			}
			else if (USER_AGENT.match(/Chromium[\/][\.\d]+/i)) {
				USER_AGENT = 'chromium';
			}
			else if (USER_AGENT.match(/Safari[\/][\.\d]+/i) && !USER_AGENT.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)) {
				USER_AGENT = 'safari';
			}
			else if (USER_AGENT.match(/(?:Opera|OPR)[\/][\.\d]+/i)) {
				USER_AGENT = 'opera';
			}
			else if (USER_AGENT.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)) {
				USER_AGENT = 'ie';
			}
			else {
				USER_AGENT = 'unknown';
			}
			ns.USER_AGENT = USER_AGENT;
			Object.freeze(ns.USER_AGENT);

			ns.userAgent = function () {
				ns.log('TRACE', ['EngineMetaUserAgent.userAgent']);
				return USER_AGENT;
			};
			Object.freeze(ns.userAgent);

			ns.userAgentEqual = function (ua) {
				ns.log('TRACE', ['EngineMetaUserAgent.userAgentEqual', ua]);
				return of(ua, 'string') ? USER_AGENT===ua : false;
			};
			Object.freeze(ns.userAgentEqual);

			ns.userAgentLike = function (ua) {
				ns.log('TRACE', ['EngineMetaUserAgent.userAgentLike', ua]);
				return of(ua, 'array') ? ua.includes(USER_AGENT) : false;
			};
			Object.freeze(ns.userAgentLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaUserAgent done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaUserAgent', error]);
			reject('engineMetaUserAgent: ' + error);
		}
	});
};
