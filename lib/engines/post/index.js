'use strict';


var config = require('./config.json');
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
			ns.log('TRACE', ['EnginePost']);

			// post
			//
			// {
			//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
			//   'fieldName2': [ ... ],
			//   ...
			// }
			//
			var POST = ns.POST = {};
			var posts = ns.posts = function () {
				ns.log('TRACE', ['EnginePost.posts']);
				return __object2keys(POST);
			};
			var postAmount = ns.postAmount = function (name) {
				ns.log('TRACE', ['EnginePost.postAmount', name]);
				return __object2itemLength(POST, name);
			};
			var post = ns.post = function (name, index) {
				ns.log('TRACE', ['EnginePost.post', name, index]);
				return __object2item(POST, name, index);
			};
			Object.freeze(ns.posts);
			Object.freeze(ns.postAmount);
			Object.freeze(ns.post);

			// post extra
			//
			var postObjects = ns.postObjects = function (index) {
				ns.log('TRACE', ['EnginePost.postObjects', index]);
				return __objectWalk(POST, function (item, index, field) {
					return { field: field, value: item };
				});
			};
			Object.freeze(ns.postObjects);

			// upload
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
			//
			var UPLOAD = ns.UPLOAD = {};
			var uploads = ns.uploads = function () {
				ns.log('TRACE', ['EnginePost.uploads']);
				return __object2keys(UPLOAD);
			};
			var uploadAmount = ns.uploadAmount = function (name) {
				ns.log('TRACE', ['EnginePost.uploadAmount', name]);
				return __object2itemLength(UPLOAD, name);
			};
			var upload = ns.upload = function (name, index) {
				ns.log('TRACE', ['EnginePost.upload', name, index]);
				return __object2item(UPLOAD, name, index);
			};
			var uploadClean = ns.uploadClean = function () {
				ns.log('TRACE', ['EnginePost.uploadClean']);
				__objectWalk(UPLOAD, function (item, index, field) {
					fs.unlink(item.path, function (error) { });
				});
			};
			Object.freeze(ns.uploads);
			Object.freeze(ns.uploadAmount);
			Object.freeze(ns.upload);
			Object.freeze(ns.uploadClean);

			// upload extra
			//
			var uploadContentType = ns.uploadContentType = function (name, index) {
				ns.log('TRACE', ['EnginePost.uploadContentType', name, index]);
				return __object2itemSub(UPLOAD, 'contentType', name, index);
			};
			var uploadName = ns.uploadName = function (name, index) {
				ns.log('TRACE', ['EnginePost.uploadName', name, index]);
				return __object2itemSub(UPLOAD, 'name', name, index);
			};
			var uploadPath = ns.uploadPath = function (name, index) {
				ns.log('TRACE', ['EnginePost.uploadPath', name, index]);
				return __object2itemSub(UPLOAD, 'path', name, index);
			};
			var uploadSize = ns.uploadSize = function (name, index) {
				ns.log('TRACE', ['EnginePost.uploadSize', name, index]);
				return __object2itemSub(UPLOAD, 'size', name, index);
			};
			var uploadPaths = ns.uploadPaths = function () {
				ns.log('TRACE', ['EnginePost.uploadPaths']);
				return __objectWalk(UPLOAD, function (item, index, field) {
					return item.path;
				});
			};
			var uploadObjects = ns.uploadObjects = function (key) {
				ns.log('TRACE', ['EnginePost.uploadObjects', key]);
				return __object2items(UPLOAD, key);
			};
			Object.freeze(ns.uploadContentType);
			Object.freeze(ns.uploadName);
			Object.freeze(ns.uploadPath);
			Object.freeze(ns.uploadSize);
			Object.freeze(ns.uploadPaths);
			Object.freeze(ns.uploadObjects);

			// uploading post data preparations
			//
			var nr = ns.request, re = /^([\w\-]+[\/][\w\+\-\_]+)/i, loading, loadingOptions, loadMIME;
			var ct = re.exec(config['methods'].indexOf(nr.method.toLowerCase())>-1 ? nr.headers['content-type'] : '-/-');
			switch((ct ? ct[1] : '').toLowerCase()){
				case '-/-': loading = loadingOptions = loadMIME = false; break;
				case 'multipart/form-data':
					loadMIME = ct[1];
					loading = multipart_form_data;
					loadingOptions = config['multipart/form-data'];
					break;
				case 'application/json':
					loadMIME = ct[1];
					loading = application_json;
					loadingOptions = config['application/json'];
					break;
				case 'application/x-www-form-urlencoded':
					loadMIME = ct[1];
					loading = application_x_www_form_urlencoded;
					loadingOptions = config['application/x-www-form-urlencoded'];
					break;
				case 'text/plain':
					loadMIME = ct[1];
					loading = text_plain;
					loadingOptions = config['text/plain'];
					break;
				default: loading = loadingOptions = loadMIME = undefined;
			}

			// uploading action
			//
			var uploaded = undefined;
			ns.uploading = function (options) {
				return new Promise(function (resolve, reject){
					ns.log('TRACE', ['EnginePost.uploading', options]);
					if (uploaded!==undefined) {
						ns.log('TRACE', ['EnginePost.uploading from uploaded', uploaded]);
						uploaded>0 ? resolve(uploaded===1 ? true : false) : reject(false);
					}
					else if (config['enable']) {
						ns.log('TRACE', ['EnginePost.uploading enable']);
						if (loading) {
							ns.log('TRACE', ['EnginePost.uploading enctype', loadMIME]);
							loading(ns, Object.assign({}, config['*/*'], loadingOptions, options))
								.then(function (_ns) {
									ns.log('DEBUG', ['EnginePost.uploading successes', ]);
									uploaded = 1;
									Object.freeze(ns.POST);
									Object.freeze(ns.UPLOAD);
									resolve(true);
								})
								.catch(function (_error) {
									ns.log('ERROR', ['EnginePost.uploading unsuccesses', ]);
									uploaded = -1;
									Object.freeze(ns.POST);
									Object.freeze(ns.UPLOAD);
									reject(false);
								});
						}
						else if (loading===false) {
							ns.log('TRACE', ['EnginePost.uploading no post expected with method', nr.method]);
							uploaded = 2;
							Object.freeze(ns.POST);
							Object.freeze(ns.UPLOAD);
							resolve(false);
						}
						else {
							ns.log('WARNING', ['EnginePost.uploading enctype unknown', nr.headers['content-type']]);
							uploaded = -2;
							Object.freeze(ns.POST);
							Object.freeze(ns.UPLOAD);
							reject('Error [EnginePost]: unknown Content-Type "' + nr.headers['content-type'] + '"');
						}
					}
					else {
						ns.log('TRACE', ['EnginePost.uploading disable']);
						uploaded = 3;
						resolve(false);
					}
				});
			};
			Object.freeze(ns.uploading);

			//
			if ('autoUploading' in config && config['autoUploading']) {
				ns.uploading({}).then(resolve, reject);
			}
			else {
				resolve(loading && config['enable']);
			}
			ns.log('TRACE', ['EnginePost done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EnginePost', error]);
			reject('enginePost: ' + error);
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
