'use strict';


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaAcceptLanguage']);

			// acceptLanguage : 'accept-language'
			//
			var ACCEPT_LANGUAGE = ns.ACCEPT_LANGUAGE = (ns.request.headers['accept-language'] || '*').toLowerCase();
			Object.freeze(ns.ACCEPT_LANGUAGE);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaAcceptLanguage done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaAcceptLanguage', error]);
			reject('engineMetaAcceptLanguage: ' + error);
		}
	});
};
