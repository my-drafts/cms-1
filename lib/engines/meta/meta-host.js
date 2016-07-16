'use strict';


var type = require('zanner-typeof'), of = type.of;


var reverse = function (a) {
	var A = a.map(function (item, index) { return item; });
	A.reverse();
	return A;
};


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaHost']);

			// host
			//
			var HOST = ns.HOST = (reverse((ns.request.headers.host.split(':', 1)[0]).toLowerCase().split('.')));
			Object.freeze(ns.HOST);

			ns.host = function () {
				ns.log('TRACE', ['EngineMetaHost.host']);
				return reverse(HOST).join('.');
			};
			Object.freeze(ns.host);

			ns.hostEqual = function (h) {
				ns.log('TRACE', ['EngineMetaHost.hostEqual', h]);
				if (of(h, 'string')) {
					return reverse(HOST).join('.')==h;
				}
				else if (of(h, 'array')) {
					return reverse(HOST).join('.')==h.join('.') || reverse(HOST).join('.')==reverse(h).join('.');
				}
				return false;
			};
			Object.freeze(ns.hostEqual);

			ns.hostLike = function (h) {
				ns.log('TRACE', ['EngineMetaHost.hostLike', h]);
				return of(h, 'regex') ? h.test(reverse(HOST).join('.')) || h.test(HOST.join('.')) : false;
			};
			Object.freeze(ns.hostLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaHost done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaHost', error]);
			reject('engineMetaHost: ' + error);
		}
	});
};
