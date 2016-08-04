'use strict';


// post
//
// {
//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
//   'fieldName2': [ ... ],
//   ...
// }
//


// upload
//
// {
//   'fieldName1': [
//     {
//       'fieldName': 'fieldName1',
//       'originalFilename': 'originalFilename1',
//       'path': 'temporaryFilePath1',
//       'headers': {
//         'content-disposition': 'form-data; name="f2.2"; filename="1-image-margin-boxes-large-opt.jpg"',
//         'content-type': 'mime1',
//         ...
//       },
//       'size': 24496
//     },
//     ...
//   ],
//   'fieldName2': [ ... ],
//   ...
// }
//


var a = require('./actions');
var multiparty = require('multiparty');
var type = require('zanner-typeof'), of = type.of;
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	size: 'maxFieldsSize', // number
	amount: 'maxFields', // number
	upload: 'maxFilesSize', // number | string:'Infinity'
	path: 'uploadDir' // string
};


// multipart/form-data
module.exports = function (nameSpace, optionSpace) {
	let ns = nameSpace;
	let os = optionSpace;
	let osm = optionSpaceMap;
	let o = {
		autoFields: true,
		autoFiles: true,
		encoding: 'utf8',
		maxFieldsSize: 1024 * 8, // 8kb
		maxFields: 8,
		maxFilesSize: 1024 * 1024 * 8, // 'Infinity'
		uploadDir: 'tmp/upload'
	};
	let files2file = function (file, index) {
		let f = {
			contentType: file.headers['content-type'],
			field: file.fieldName,
			name: file.originalFilename,
			path: file.path,
			size: file.size,
			contentDisposition: file.headers['content-disposition'],
			headers: Object.assign({}, file.headers)
		};
		return f;
	};
	let files2files = function (files) {
		let items = {};
		for (let fn in files) {
			items[fn] = files[fn].map(files2file);
		}
		return items;
	};
	return new Promise (function (resolve, reject) {
		if (os && os.enable===true) {
			Object.assign(o, a.options4map(osm, os));
			if (o.maxFilesSize<0) {
				o.maxFilesSize = 'Infinity';
			}
			let form = new multiparty.Form(o);
			form.parse(ns.request, function (error, fields, files) {
				if (error) {
					reject('multipart/form-data POST: ' + error);
				}
				else {
					Object.assign(ns.POST, fields);
					files = files2files(files);
					Object.assign(ns.UPLOAD, files);
					resolve(ns);
				}
			});
		}
		else {
			resolve(ns);
		}
	});
};

