'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaContenType']);

			// contentType
			//
			var CONTENT_TYPE = ns.CONTENT_TYPE = (ns.request.headers['content-type'] || '-/-').toLowerCase();
			Object.freeze(ns.CONTENT_TYPE);

			ns.contentType = function () {
				ns.log('TRACE', ['EngineMetaContenType.contentType']);
				return CONTENT_TYPE;
			};
			Object.freeze(ns.contentType);

			ns.contentTypeEqual = function (ct) {
				ns.log('TRACE', ['EngineMetaContenType.contentTypeEqual', ct]);
				return of(ct, 'string') ? CONTENT_TYPE===ct : false;
			};
			Object.freeze(ns.contentTypeEqual);

			ns.contentTypeLike = function (ct) {
				ns.log('TRACE', ['EngineMetaContenType.contentTypeLike', ct]);
				return of(ct, 'array') ? ct.includes(CONTENT_TYPE) : of(ct, 'regex') ? ct.test(CONTENT_TYPE) : false;
			};
			Object.freeze(ns.contentTypeLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaContenType done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaContenType', error]);
			reject('engineMetaContentType: ' + error);
		}
	});
};
