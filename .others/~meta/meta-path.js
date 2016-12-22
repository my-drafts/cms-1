'use strict';


var url = require('url');
var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaPath']);

			var PATH_RE = /^[\/]?(.*?)[\/]?$/;
			// path
			//
			// [ 'dir1', ... ]
			//
			var PATH = ns.PATH = url.parse(ns.request.url, true).pathname.replace(PATH_RE, '$1').toLowerCase().split('/');
			Object.freeze(ns.PATH);

			ns.path = function () {
				ns.log('TRACE', ['EngineMetaPath.path']);
				return '/' + PATH.join('/');
			};
			Object.freeze(ns.path);

			ns.pathEqual = function (p) {
				ns.log('TRACE', ['EngineMetaPath.pathEqual', p]);
				if (of(p, 'string')) {
					return PATH.join('/')==p.replace(/^[\/]?(.*?)[\/]?$/, '$1');
				}
				else if (of(p, 'array')) {
					return PATH.join('/')==p.join('/');
				}
				return false;
			};
			Object.freeze(ns.pathEqual);

			ns.pathLike = function (p) {
				ns.log('TRACE', ['EngineMetaPath.pathLike', p]);
				if (of(p, 'string')) {
					return PATH.sort().join('/')==p.replace(/^[\/]?(.*?)[\/]?$/, '$1').split('/').sort().join('/');
				}
				else if (of(p, 'array')) {
					return PATH.sort().join('/')==p.sort().join('/');
				}
				else if (of(p, 'regex')) {
					return p.test(PATH) ? true : false;
				}
				return false;
			};
			Object.freeze(ns.pathLike);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaPath done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaPath', error]);
			reject('engineMetaAccept: ' + error);
		}
	});
};
