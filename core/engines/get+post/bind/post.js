'use strict';


var a = require('../lib/actions');
var post_json = require('../lib/post/application_json');
var post_form_urlencoded = require('../lib/post/application_x-www-form-urlencoded');
var post_multipart = require('../lib/post/multipart_form-data');
var post_plain = require('../lib/post/text_plain');
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
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postKeys', ['call']);
	let result = a.akeys(ns.g('POST'));
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postKeys', ['called', result]);
	return result;
};
var postAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postAmount', ['call', name]);
	let result = a.alength(ns.g('POST'), name);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postAmount', ['called', result]);
	return result;
};
var post = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.post', ['call', name, index]);
	let result = a.aitem(ns.g('POST'), name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.post', ['called', result]);
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
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postObjects', ['call']);
	let result = a.awalk(ns.g('POST'), postObjectsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.postObjects', ['called', result]);
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
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadKeys', ['call']);
	let result = a.akeys(ns.g('UPLOAD'));
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadKeys', ['called', result]);
	return result;
};
var uploadAmount = function(ns, name, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadAmount', ['call', name]);
	let result = a.alength(ns.g('UPLOAD'), name);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadAmount', ['called', result]);
	return result;
};
var upload = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.upload', ['call', name, index]);
	let result = a.aitem(ns.g('UPLOAD'), name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.upload', ['called', result]);
	return result;
};
var uploadCleanWalk = function(item, index, field){
	return new Promise(function(resolve, reject){
		fs.unlink(item.path, function(error){
			if(error){
				resolve(Object.assign({}, item, {index: index}, {error: error}));
			}
			else{
				let result = Object.assign({}, item, {index: index});
				resolve(result); // reject(result);
			}
		});
	});
};
var uploadClean = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadClean', ['call']);
	let items = a.awalk(ns.g('UPLOAD'), uploadCleanWalk);
	return Promise.all(items).then(function(result){
		quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadClean', ['called', result]);
	});
};
var uploadObjects = function(ns, key, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadObjects', ['call', key]);
	let result = a.aitems(ns.g('UPLOAD'), key);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadObjects', ['called', result]);
	return result;
};
var uploadPathsWalk = function(item, index, field){
	return item.path;
};
var uploadPaths = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadPaths', ['call']);
	let result = a.awalk(ns.UPLOAD, uploadPathsWalk);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadPaths', ['called', result]);
	return result;
};
var uploadContentType = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadContentType', ['call', name, index]);
	let result = a.afitem(ns.UPLOAD, 'contentType', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadContentType', ['called', result]);
	return result;
};
var uploadName = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadName', ['call', name, index]);
	let result = a.afitem(ns.UPLOAD, 'name', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadName', ['called', result]);
	return result;
};
var uploadPath = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadPath', ['call', name, index]);
	let result = a.afitem(ns.UPLOAD, 'path', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadPath', ['called', result]);
	return result;
};
var uploadSize = function(ns, name, index, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadSize', ['call', name, index]);
	let result = a.afitem(ns.UPLOAD, 'size', name, index);
	quiet ? 0 : ns.log('DEBUG', 'engine.post.uploadSize', ['called', result]);
	return result;
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.post.init', []);
	ns.s('POST', {}, false);
	ns.s('UPLOAD', {}, false);
	ns.s('postKeys', function(){
		return postKeys(ns, config.quiet);
	}, true);
	ns.s('postAmount', function(name){
		return postAmount(ns, name, config.quiet);
	}, true);
	ns.s('post', function(name, index){
		return post(ns, name, index, config.quiet);
	}, true);
	ns.s('postObjects', function(){
		return postObjects(ns, config.quiet);
	}, true);
	ns.s('uploadKeys', function(ns){
		return uploadKeys(ns, config.quiet);
	}, true);
	ns.s('uploadAmount', function(name){
		return uploadAmount(ns, name, config.quiet);
	}, true);
	ns.s('upload', function(name, index){
		return upload(ns, name, index, config.quiet);
	}, true);
	ns.s('uploadClean', function(){
		return uploadClean(ns, config.quiet);
	}, true);
	ns.s('uploadObjects', function(key){
		return uploadObjects(ns, key, config.quiet);
	}, true);
	ns.s('uploadPaths', function(){
		return uploadPaths(ns, config.quiet);
	}, true);
	ns.s('uploadContentType', function(name, index){
		return uploadContentType(ns, name, index, config.quiet);
	}, true);
	ns.s('uploadName', function(name, index){
		return uploadName(ns, name, index, config.quiet);
	}, true);
	ns.s('uploadPath', function(name, index){
		return uploadPath(ns, name, index, config.quiet);
	}, true);
	ns.s('uploadSize', function(name, index){
		return uploadSize(ns, name, index, config.quiet);
	}, true);
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
	config.quiet ? 0 : ns.log('TRACE', 'engine.post.auto', []);
	let loaded = undefined;
	let al = autoLoading(ns, config);
	let loading = al.loading, loadingOptions = al.loadingOptions, loadMIME = al.loadMIME;
	if(loaded!==undefined){
		config.quiet ? 0 : ns.log('DEBUG', 'engine.post.auto', ['from loaded', loaded]);
		return Promise.resolve({post: loaded>0});
	}
	else if(config.enable!==true){
		config.quiet ? 0 : ns.log('DEBUG', 'engine.post.auto', ['disabled']);
		ns.f('POST');
		ns.f('UPLOAD');
		loaded = -3;
		return Promise.resolve({post: false});
	}
	else if(loading===false){
		config.quiet ? 0 : ns.log('DEBUG', 'engine.post.auto', ['no post-method']);
		ns.f('POST');
		ns.f('UPLOAD');
		loaded = 2;
		return Promise.resolve({post: true});
	}
	else if(!loading){
		config.quiet ? 0 : ns.log('WARNING', 'engine.post.auto', ['enctype unknown', loadMIME]);
		ns.f('POST');
		ns.f('UPLOAD');
		loaded = -2;
		return Promise.resolve({post: false});
	}
	else{
		config.quiet ? 0 : ns.log('DEBUG', 'engine.post.auto', ['enable']);
		let options = Object.assign({}, config['*/*'], loadingOptions);
		return loading(ns, options)
			.then(function(result){
				config.quiet ? 0 : ns.log('DEBUG', 'engine.post.auto', ['successes']);
				ns.f('POST');
				ns.f('UPLOAD');
				loaded = 1;
				return {post: true};
			})
			.catch(function(error){
				config.quiet ? 0 : ns.log('ERROR', 'engine.post.auto', ['unsuccesses', error]);
				ns.f('POST');
				ns.f('UPLOAD');
				loaded = -1;
				return error;
			});
	}
};
module.exports.auto = auto;


var done = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.post.done', []);
	let cleaned = function(){
		return Promise.resolve({post: config.enable===true});
	};
	return (config.enable===true && config.cleanUp===true) ? ns.uploadClean().then(cleaned) : cleaned();
};
module.exports.done = done;

