'use strict';


var a = require('./../actions');
var post_json = require('./../post-application_json');
var post_form_urlencoded = require('./../post-application_x-www-form-urlencoded');
var post_multipart = require('./../post-multipart_form-data');
var post_plain = require('./../post-text_plain');
var fs = require('fs');
var type = require('zanner-typeof'), of = type.of;


// post
//
// {
//   'fieldName1': [ 'value1-1', 'value1-2', ... ],
//   'fieldName2': [ ... ],
//   ...
// }
//
var postKeys = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call posts']);
	let result = a.akeys(ns.POST);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called posts', result]);
	return result;
};
var postAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call postAmount', name]);
	let result = a.alength(ns.POST, name);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called postAmount', result]);
	return result;
};
var post = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call post', name, index]);
	let result = a.aitem(ns.POST, name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called post', result]);
	return result;
};
var postObjectsWalk = function(item, index, field){
	return {
		field: field,
		value: item,
		index: index
	};
};
var postObjects = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call postObjects']);
	let result = a.awalk(ns.POST, postObjectsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called postObjects', result]);
	return result;
};


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
var uploadKeys = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploads']);
	let result = a.akeys(ns.UPLOAD);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploads', result]);
	return result;
};
var uploadAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadAmount', name]);
	let result = a.alength(ns.UPLOAD, name);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadAmount', result]);
	return result;
};
var upload = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call upload', name, index]);
	let result = a.aitem(ns.UPLOAD, name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called upload', result]);
	return result;
};
var uploadCleanWalk = function(item, index, field){
	fs.unlink(item.path, function(error){
	});
	return item.path;
};
var uploadClean = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadClean']);
	let result = a.awalk(ns.UPLOAD, uploadCleanWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadClean', result]);
	return result;
};
var uploadObjects = function(ns, key, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadObjects', key]);
	let result = a.aitems(ns.UPLOAD, key);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadObjects', result]);
	return result;
};
var uploadPathsWalk = function(item, index, field){
	return item.path;
};
var uploadPaths = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadPaths']);
	let result = a.awalk(ns.UPLOAD, uploadPathsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadPaths', result]);
	return result;
};
var uploadContentType = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadContentType', name, index]);
	let result = a.afitem(ns.UPLOAD, 'contentType', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadContentType', result]);
	return result;
};
var uploadName = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadName', name, index]);
	let result = a.afitem(ns.UPLOAD, 'name', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadName', result]);
	return result;
};
var uploadPath = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadPath', name, index]);
	let result = a.afitem(ns.UPLOAD, 'path', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadPath', result]);
	return result;
};
var uploadSize = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['call uploadSize', name, index]);
	let result = a.afitem(ns.UPLOAD, 'size', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine::post', ['called uploadSize', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine::post', ['init']);
	ns.POST = {};
	ns.UPLOAD = {};
	ns.postKeys = function(){
		return postKeys(ns, config.quiet);
	};
	ns.postAmount = function(name){
		return postAmount(ns, name, config.quiet);
	};
	ns.post = function(name, index){
		return post(ns, name, index, config.quiet);
	};
	ns.postObjects = function(){
		return postObjects(ns, config.quiet);
	};
	ns.uploadKeys = function(ns){
		return uploadKeys(ns, config.quiet);
	};
	ns.uploadAmount = function(name){
		return uploadAmount(ns, name, config.quiet);
	};
	ns.upload = function(name, index){
		return upload(ns, name, index, config.quiet);
	};
	ns.uploadClean = function(){
		return uploadClean(ns, config.quiet);
	};
	ns.uploadObjects = function(key){
		return uploadObjects(ns, key, config.quiet);
	};
	ns.uploadPaths = function(){
		return uploadPaths(ns, config.quiet);
	};
	ns.uploadContentType = function(name, index){
		return uploadContentType(ns, name, index, config.quiet);
	};
	ns.uploadName = function(name, index){
		return uploadName(ns, name, index, config.quiet);
	};
	ns.uploadPath = function(name, index){
		return uploadPath(ns, name, index, config.quiet);
	};
	ns.uploadSize = function(name, index){
		return uploadSize(ns, name, index, config.quiet);
	};
	Object.freeze(ns.posts);
	Object.freeze(ns.postAmount);
	Object.freeze(ns.post);
	Object.freeze(ns.postObjects);
	Object.freeze(ns.uploads);
	Object.freeze(ns.uploadAmount);
	Object.freeze(ns.upload);
	Object.freeze(ns.uploadClean);
	Object.freeze(ns.uploadObjects);
	Object.freeze(ns.uploadPaths);
	Object.freeze(ns.uploadContentType);
	Object.freeze(ns.uploadName);
	Object.freeze(ns.uploadPath);
	Object.freeze(ns.uploadSize);
	return Promise.resolve({post: config.enable===true});
};
module.exports.init = init;


var autoLoading = function(ns, config){
	let MIME_RE = /^([\w\-\_]+[\/][\w\-\_\+]+)/;
	let nr = ns.request;
	let nm = nr.method.toLowerCase();
	let nct = nr.headers['content-type'];
	let ct = MIME_RE.exec(config.methods.indexOf(nm)> -1 ? nct : '-/-');
	ct = ct ? ct[1].toLowerCase() : '';
	switch(ct){
		case '-/-':
			return {
				loading: false,
				loadingOptions: false,
				loadMIME: false
			};
		case 'multipart/form-data':
			return {
				loading: post_multipart,
				loadingOptions: config['multipart/form-data'],
				loadMIME: ct
			};
		case 'application/json':
			return {
				loading: post_json,
				loadingOptions: config['application/json'],
				loadMIME: ct
			};
		case 'application/x-www-form-urlencoded':
			return {
				loading: post_form_urlencoded,
				loadingOptions: config['application/x-www-form-urlencoded'],
				loadMIME: ct
			};
		case 'text/plain':
			return {
				loading: post_plain,
				loadingOptions: config['text/plain'],
				loadMIME: ct
			};
		default:
			return {
				loading: undefined,
				loadingOptions: undefined,
				loadMIME: undefined
			};
	}
};
var auto = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine::post', ['auto']);
	let loaded = undefined;
	let al = autoLoading(ns, config);
	let loading = al.loading, loadingOptions = al.loadingOptions, loadMIME = al.loadMIME;
	if(config.enable!==true){
		config.quiet ? 0 : ns.log('DEBUG', 'engine::post', ['auto disabled']);
		return Promise.resolve({post: false});
	}
	else if(loaded){
		config.quiet ? 0 : ns.log('DEBUG', 'engine::post', ['auto from loaded', loaded]);
		return Promise.resolve({post: loaded>0});
	}
	else if(loading===false){
		config.quiet ? 0 : ns.log('DEBUG', 'engine::post', ['auto with no post-method']);
		Object.freeze(ns.POST);
		Object.freeze(ns.UPLOAD);
		loaded = 2;
		return Promise.resolve({post: true});
	}
	else if(!loading){
		config.quiet ? 0 : ns.log('WARNING', 'engine::post', ['auto with unknown encntype', loadMIME]);
		Object.freeze(ns.POST);
		Object.freeze(ns.UPLOAD);
		loaded = -2;
		return Promise.resolve({post: false});
	}
	else{
		config.quiet ? 0 : ns.log('DEBUG', 'engine::post', ['auto enable']);
		let options = Object.assign({}, config['*/*'], loadingOptions);
		return loading(ns, options)
			.then(function(result){
				config.quiet ? 0 : ns.log('DEBUG', 'engine::post', ['auto successes']);
				Object.freeze(ns.POST);
				Object.freeze(ns.UPLOAD);
				loaded = 1;
				return {post: true};
			})
			.catch(function(error){
				config.quiet ? 0 : ns.log('ERROR', 'engine::post', ['auto unsuccesses', error]);
				Object.freeze(ns.POST);
				Object.freeze(ns.UPLOAD);
				loaded = -1;
				return error;
			});
	}
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine::post', ['done']);
	// ???
	// ns.uploadClean();
	return Promise.resolve({post: config.enable===true});
};
module.exports.done = done;

