'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaStatusCode']);

			// statusCode
			//
			var STATUS_CODE = ns.STATUS_CODE = (ns.request.statusCode || 0);
			Object.freeze(ns.STATUS_CODE);

			ns.statusCode = function () {
				ns.log('TRACE', ['EngineMetaStatusCode.statusCode']);
				return STATUS_CODE;
			};
			Object.freeze(ns.statusCode);

			ns.statusCodeEqual = function (sc) {
				ns.log('TRACE', ['EngineMetaStatusCode.statusCodeEqual', sc]);
				return of(sc, 'number') || of(sc, 'string') ? sc==STATUS_CODE : false;
			};
			Object.freeze(ns.statusCodeEqual);

			ns.statusCodeLike = function (sc) {
				ns.log('TRACE', ['EngineMetaStatusCode.statusCodeLike', sc]);
				if (of(sc, 'array')) {
					return sc.some(function(item, index) { return ns.statusCodeLike(item); });
				}
				else if (of(sc, 'regex')) {
					return sc.test(STATUS_CODE) ? true : false;
				}
				return ns.statusCodeEqual(sc);
			};
			Object.freeze(ns.statusCodeLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaStatusCode done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaStatusCode', error]);
			reject('engineMetaStatusCode: ' + error);
		}
	});
};
