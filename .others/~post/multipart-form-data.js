'use strict';


var multiparty = require('multiparty');
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	postSize: 'maxFieldsSize', // number
	postAmount: 'maxFields', // number
	fileSize: 'maxFilesSize', // number | string:'Infinity'
	fileDir: 'uploadDir' // string
};


// multipart/form-data
module.exports = function (nameSpace, optionSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;
			if (optionSpace && ('enable' in optionSpace) && !optionSpace['enable']) {
				resolve(ns);
			}
			else {
				// options
				//
				var options = {
					autoFields: true,
					autoFiles: true,
					encoding: 'utf8',
					maxFieldsSize: 1024 * 8, // 8kb
					maxFields: 8,
					maxFilesSize: 1024 * 1024 * 8, // 'Infinity'
					uploadDir: 'tmp/upload'
				};
				for (var o in optionSpaceMap) {
					if (optionSpace && (o in optionSpace)){
						options[optionSpaceMap[o]] = optionSpace[o];
					}
				}
				if (options['maxFilesSize']<0) {
					options['maxFilesSize'] = 'Infinity';
				}

				// uploading
				//
				var POST = ns.POST;
				var UPLOAD = ns.UPLOAD;
				var form = new multiparty.Form(options);
				form.parse (ns.request, function (error, fields, files) {
					if (error) {
						reject(error);
					}
					else {
						// {
						//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
						//   'fieldName2': [ ... ],
						//   ...
						// }
						Object.assign(POST, fields);

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
						for (let fieldName in files) {
							let items = files[fieldName];
							var ff = [];
							for (let index=0; index<items.length; index++) {
								let item = items[index];
								var f = {
									contentType: item.headers['content-type'],
									field: item.fieldName,
									name: item.originalFilename,
									path: item.path,
									size: item.size,
									contentDisposition: item.headers['content-disposition'],
									headers: Object.assign({}, item.headers)
								};
								ff.push(f);
							}
							UPLOAD[fieldName] = ff;
						}
						resolve(ns);
					}
				});
			}
		}
		catch (error) {
			reject(error);
		}
	});
};
