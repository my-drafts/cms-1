'use strict';


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaAcceptEncondig']);

			// acceptEncoding
			//
			var ACCEPT_ENCODING = ns.ACCEPT_ENCODING = (ns.request.headers['accept-encoding'] || '*').toLowerCase();
			Object.freeze(ns.ACCEPT_ENCODING);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaAcceptEncondig done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaAcceptEncondig', error]);
			reject('engineMetaAcceptEncondig: ' + error);
		}
	});
};
