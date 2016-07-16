'use strict';


var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaStatusMessage']);

			// statusMessage
			//
			var STATUS_MESSAGE = ns.STATUS_MESSAGE = (ns.request.statusMessage || '').toLowerCase();
			Object.freeze(ns.STATUS_MESSAGE);

			ns.statusMessage = function () {
				ns.log('TRACE', ['EngineMetaStatusMessage.statusMessage']);
				return STATUS_MESSAGE;
			};
			Object.freeze(ns.statusMessage);

			ns.statusMessageEqual = function (sm) {
				ns.log('TRACE', ['EngineMetaStatusMessage.statusMessageEqual', sm]);
				return of(sm, 'string') ? sm.toLowerCase()==STATUS_MESSAGE : false;
			};
			Object.freeze(ns.statusMessageEqual);

			ns.statusMessageLike = function (sm) {
				ns.log('TRACE', ['EngineMetaStatusMessage.statusMessageLike', sm]);
				if (of(sm, 'array')) {
					return sm.some(function(item, index) { return ns.statusMessageLike(item); });
				}
				else if (of(sm, 'regex')) {
					return sm.test(STATUS_MESSAGE) ? true : false;
				}
				return ns.statusMessageEqual(sm);
			};
			Object.freeze(ns.statusMessageLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaStatusMessage done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaStatusMessage', error]);
			reject('engineMetaStatusMessage: ' + error);
		}
	});
};
