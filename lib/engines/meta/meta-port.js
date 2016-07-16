'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaPort']);

			// port
			//
			var PORT = ns.PORT = Number(ns.request.headers.host.split(':', 2)[1]);
			Object.freeze(ns.PORT);

			ns.port = function () {
				ns.log('TRACE', ['EngineMetaPort.port']);
				return PORT;
			};
			Object.freeze(ns.port);

			ns.portEqual = function (p) {
				ns.log('TRACE', ['EngineMetaPort.portEqual', p]);
				return of(p, 'number') || of(p, 'string') ? PORT==p : false;
			};
			Object.freeze(ns.pathEqual);

			ns.portLike = function (p) {
				ns.log('TRACE', ['EngineMetaPort.portLike', p]);
				if (of(p, 'array')) {
					return p.some(function(item, index) { return ns.portLike(item); });
				}
				else if (of(p, 'regex')) {
					return p.test(PORT) ? true : false;
				}
				return ns.portEqual(p);
			};
			Object.freeze(ns.portLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaPort done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaPort', error]);
			reject('engineMetaAccept: ' + error);
		}
	});
};
