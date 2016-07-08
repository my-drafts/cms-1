'use strict';


var config = require('./index.json');
var application_json = require('./application-json');
var application_x_www_form_urlencoded = require('./application-x-www-form-urlencoded');
var multipart_form_data = require('./multipart-form-data');
var text_plain = require('./text-plain');
var fs = require('fs');
var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise (function (resolve, reject) {
		try {
			var ns = nameSpace;

			// post
			//
			// {
			//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
			//   'fieldName2': [ ... ],
			//   ...
			// }
			ns.POST = {};
			ns.posts = function () {
				return __object2keys(ns.POST);
			};
			ns.postAmount = function (name) {
				return __object2itemLength(ns.POST, name);
			};
			ns.post = function (name, index) {
				return __object2item(ns.POST, name, index);
			};
			Object.freeze(ns.posts);
			Object.freeze(ns.postAmount);
			Object.freeze(ns.post);

			// post extra
			//
			ns.postObjects = function (index) {
				return __objectWalk(ns.POST, function (item, index, field) {
					return { field: field, value: item };
				});
			};
			Object.freeze(ns.postObjects);

			// file
			//
			// {
			//   'field1': [
			//     {
			//       'contentType': 'mime1',
			//       'field': 'fieldName1',
			//       'name': 'originalFilename1',
			//       'path': 'temporaryFilePath1',
			//       'size': 24496,
			//       'headers': {
			//         'content-disposition': 'form-data; name="f2.2"; filename="1-image-margin-boxes-large-opt.jpg"'
			//         ...
			//       }
			//     },
			//     ...
			//   ],
			//   'field2': [ ... ],
			//   ...
			// }
			ns.FILE = {};
			ns.files = function () {
				return __object2keys(ns.FILE);
			};
			ns.fileAmount = function (name) {
				return __object2itemLength(ns.FILE, name);
			};
			ns.file = function (name, index) {
				return __object2item(ns.FILE, name, index);
			};
			ns.fileClean = function () {
				__objectWalk(ns.FILE, function (file, index, field) {
					fs.unlink(file.path, function (error) { });
				});
			};
			Object.freeze(ns.files);
			Object.freeze(ns.fileAmount);
			Object.freeze(ns.file);
			Object.freeze(ns.fileClean);

			// file extra
			//
			ns.fileContentType = function (name, index) {
				return __object2itemSub(ns.FILE, 'contentType', name, index);
			};
			ns.fileName = function (name, index) {
				return __object2itemSub(ns.FILE, 'name', name, index);
			};
			ns.filePath = function (name, index) {
				return __object2itemSub(ns.FILE, 'path', name, index);
			};
			ns.fileSize = function (name, index) {
				return __object2itemSub(ns.FILE, 'size', name, index);
			};
			ns.filePaths = function () {
				return __objectWalk(ns.FILE, function (file, index, field) {
					return file.path;
				});
			};
			ns.fileObjects = function (key) {
				return __object2items(ns.FILE, key);
			};
			Object.freeze(ns.fileContentType);
			Object.freeze(ns.fileName);
			Object.freeze(ns.filePath);
			Object.freeze(ns.fileSize);
			Object.freeze(ns.filePaths);
			Object.freeze(ns.fileObjects);

			if (config['enable']) {
				// loading post data
				//
				var nr = ns.request, re = /^([\w\-]+[\/][\w\+\-\_]+)/i, loading;
				var ct = re.exec(config['methods'].indexOf(nr.method.toLowerCase())>-1 ? nr.headers['content-type'] : '-/-');
				switch((ct ? ct[1] : '').toLowerCase()){
					case '-/-': loading = false; break;
					case 'multipart/form-data': loading = multipart_form_data; break;
					case 'application/json': loading = application_json; break;
					case 'application/x-www-form-urlencoded': loading = application_x_www_form_urlencoded; break;
					case 'text/plain': loading = text_plain; break;
					default: loading = undefined;
				}

				// loading action
				//
				if (loading) {
					loading(ns)
						.then(function (ns) {
							Object.freeze(ns.POST);
							Object.freeze(ns.FILE);
							resolve(true);
						})
						.catch(reject);
				}
				else if (loading===false) {
					Object.freeze(ns.POST);
					Object.freeze(ns.FILE);
					resolve(false);
				}
				else {
					Object.freeze(ns.POST);
					Object.freeze(ns.FILE);
					reject('Error [EnginePost]: unknown Content-Type "' + h['content-type'] + '"');
				}
			}
			else {
				resolve(false);
			}
		}
		catch (error) {
			reject(error);
		}
	});
};


var __object2keys = function (O) {
	return Object.keys(O);
};

var __object2itemLength = function (O, key) {
	return of(O[key], 'array') ? O[key].length : -1;
};

var __object2item = function (O, key, index) {
	var L = __object2itemLength(O, key);
	if (L===1) {
		return O[key][0];
	}
	else if (L > 1) {
		return of(index, 'number') ? O[key][((index % L) + L) % L] : O[key];
	}
	else {
		throw 'Error [EnginePost]: Unknown in __object2item';
	}
};

var __objectWalk = function (O, walk) {
	var result = [];
	var Okeys = __object2keys(O);
	for (var ikey=0; ikey<Okeys.length; ikey++) {
		var key = Okeys[ikey];
		var length = __object2itemLength(O, key);
		for (var index=0; index<length; index++) {
			var item = O[key][index];
			if (of(walk, 'function')) {
				var itemResult = walk(item, index, key);
				if (!of(itemResult, 'undefined')){
					item = itemResult;
				}
			}
			result.push(item);
		}
	}
	return result;
};

var __object2itemSub = function (O, sub, key, index) {
	var result = __object2item(O, key, index ? index : 0);
	if (of(sub, 'array')){
		for (var i=0; i<sub.length; i++){
			result = result[sub[i]];
		}
	}
	else{
		result = result[sub];
	}
	return result;
};

var __object2items = function (O, key) {
	if (of(key, 'string')) {
		return __objectWalk(O, function (item, index, field) {
			return item[key];
		});
	}
	else if (of(key, 'array')) {
		return __objectWalk(O, function (item, index, field) {
			var result = {};
			for (var i=0; i<key.length; i++) {
				result[key[i]] = item[key[i]];
			}
			return result;
		});
	}
	else {
		return __objectWalk(O);
	}
};
