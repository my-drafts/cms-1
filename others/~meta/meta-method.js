'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaMethod']);

			// method
			//
			var METHOD = ns.METHOD = (ns.request.method || '').toLowerCase();
			Object.freeze(ns.METHOD);

			ns.method = function () {
				ns.log('TRACE', ['EngineMetaMethod.method']);
				return METHOD;
			};
			Object.freeze(ns.method);

			ns.methodEqual = function (m) {
				ns.log('TRACE', ['EngineMetaMethod.methodEqual', m]);
				return of(m, 'string') ? m.toLowerCase()===METHOD : false;
			};
			Object.freeze(ns.methodEqual);

			ns.methodLike = function (m) {
				ns.log('TRACE', ['EngineMetaMethod.methodLike', m]);
				if (of(m, 'array')) {
					return m.some(function(item, index) { return ns.methodLike(item); });
				}
				else if (of(m, 'regex')) {
					return m.test(METHOD) ? true : false;
				}
				return ns.methodEqual(m);
			};
			Object.freeze(ns.methodLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaMethod done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaMethod', error]);
			reject('engineMetaMethod: ' + error);
		}
	});
};
