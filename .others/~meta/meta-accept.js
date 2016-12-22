'use strict';


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaAccept']);

			// accept
			//
			var ACCEPT = ns.ACCEPT = (ns.request.headers['accept'] || '*/*').toLowerCase();
			Object.freeze(ns.ACCEPT);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaAccept done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaAccept', error]);
			reject('engineMetaAccept: ' + error);
		}
	});
};
