'use strict';


var a = require('../lib/actions');
var strong_store_cluster = require('strong-store-cluster');
var type = require('zanner-typeof'), of = type.of;


var sessionOptionsDefault = {
	sessionIdCookieName: 'session',
	sessionIdLength: 8,
	sessionIdExpires: 240
};
Object.freeze(sessionOptionsDefault);
var sessionOptions = Object.assign({}, sessionOptionsDefault);
// store: {
//   id: string,
//   created: datetime,
//   data: JSON
// }
var storeCollectionGet = function(collection, key, expires){
	return new Promise(function(resolve, reject){
		expires ? collection.configure({expireKeys: expires}) : 0;
		collection.get(key, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};
var storeCollectionSet = function(collection, key, value, expires){
	return new Promise(function(resolve, reject){
		expires ? collection.configure({expireKeys: expires}) : 0;
		collection.set(key, value, function(error){
			error ? reject(error) : resolve();
		});
	});
};
var storeDataGetter = function(id, expires){
	let sid = 'session-'+id, collection = strong_store_cluster.collection(sid), key = 'data';
	return storeCollectionGet(collection, key, expires);
};
var storeDataSetter = function(id, data, expires){
	let sid = 'session-'+id, collection = strong_store_cluster.collection(sid), key = 'data';
	return storeCollectionSet(collection, key, JSON.stringify(data), expires);
};
var storeIdChecker = function(id, expires){
	let sid = 'session-'+id, collection = strong_store_cluster.collection(sid), key = 'created';
	let now = (new Date()).toUTCString(), ee = {id: id, exists: true}, ue = function(){
		return {id: id, exists: false};
	};
	return storeCollectionGet(collection, key, expires).then(function(created){
		return created===undefined ? storeCollectionSet(collection, key, now, expires).then(ue) : ee;
	});
};
// id: string
var generateId = function(length){
	let value = Math.random().toString(36).substr(2);
	return (length>16) ? value.concat(generateId(length-16)) : (length>0) ? value.substr(0, length) : value;
};
var generateIdUnique = function(length, checker){
	let id = generateId(length);
	let checked = function(check){
		return !check.exists ? generateIdUnique(length, checker) : check.id;
	};
	return checker(id).then(checked);
};
//
var del = function(ns, key, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.del', ['call', key]);
	let data = ns.g('SESSION_DATA');
	let result = undefined;
	if(of(key, 'string') && (key in data)){
		result = data[key];
		data[key] = undefined;
		delete data[key];
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.del', ['called', result]);
	return result;
};
var get = function(ns, key, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.get', ['call', key]);
	let data = ns.g('SESSION_DATA');
	let result = !of(key, 'string') ? data : (key in data) ? data[key] : undefined;
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.get', ['called', result]);
	return result;
};
var set = function(ns, key, value, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.set', ['call', key, value]);
	let result = undefined;
	if(of(key, 'string') && value!==undefined){
		ns.g('SESSION_DATA')[key] = value;
		result = value;
	}
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.set', ['called', result]);
	return result;
};
var getId = function(ns, quiet){
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.id', ['call']);
	let result = ns.g('SESSION_ID');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.id', ['called', result]);
	return result;
};
var beginning = function(ns, quiet){
	let setId = function(id){
		console.log('xxx', id);
		quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-setId', ['call', id]);
		ns.s('SESSION_ID', id, true);
		console.log('xxx2', id);
		return id;
	};
	let setIdCookie = function(id, options){
		console.log('xxx3', id);
		quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-setIdCookie', ['call', id]);
		ns.c('cookie', [sessionOptions.sessionIdCookieName, id, Object.assign({siteOnly: true}, options)]);
		return id;
	};
	let checker = function(id){
		return storeIdChecker(id, sessionOptions.sessionIdExpires);
	};
	quiet ? 0 : ns.log('TRACE', 'engine.meta-session.beginning', ['call']);
	if(ns.g('SESSION_ID')){
		quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-twice', ['call', ns.g('SESSION_ID')]);
		return Promise.resolve(ns.g('SESSION_ID'));
	}
	else if(!ns.c('cookie', [sessionOptions.sessionIdCookieName])){
		quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-new', ['call']);
		return generateIdUnique(sessionOptions.sessionIdLength, checker)
			.then(function(id){
				quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-new', ['called', id]);
				return id;
			})
			.then(setId)
			.then(setIdCookie);
	}
	return storeIdChecker(ns.cookie(sessionOptions.sessionIdCookieName), sessionOptions.sessionIdExpires)
		.then(function(check){
			if(check.exists){
				quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-cookie', ['call', check.id]);
				return storeDataGetter(check.id, sessionOptions.sessionIdExpires)
					.then(function(data){
						quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.beginning-getData', ['call', data]);
						ns.s('SESSION_DATA', Object.assign(ns.g('SESSION_DATA'), data), false);
						return setId(check.id);
					})
					.catch(function(error){
						quiet ? 0 : ns.log('ERROR', 'engine.meta-session.beginning-getData', ['call', error]);
						setId(false);
						setIdCookie('', {expires: -1});
						return error;
					});
			}
			else{
				quiet ? 0 : ns.log('DEBUG', 'engine.meta-session-beginning-cookie-renew', ['call', check.id]);
				return Promise.resolve(check.id).then(setId).then(setIdCookie);
				//setId(false);
				//setIdCookie('', -1);
				//return Promise.resolve(false);
			}
		});
};
var ending = function(ns, quiet){
	let id = ns.g('SESSION_ID'), data = ns.g('SESSION_DATA');
	quiet ? 0 : ns.log('DEBUG', 'engine.meta-session.ending', ['call', id]);
	return id ? storeDataSetter(id, data, sessionOptions.expires) : Promise.resolve();
};


var init = function(ns, config){
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-session.init', []);
	sessionOptions = Object.assign({}, sessionOptions, config.options);
	Object.freeze(sessionOptions);
	ns.s('SESSION_ID', false, config.enable!==true);
	ns.s('SESSION_DATA', {}, config.enable!==true);
	ns.s('session', function(key, value){
		if(value===undefined){
			return ns.c('sessionGet', [key]);
		}
		else if(value===null){
			return ns.c('sessionDel', [key]);
		}
		else{
			return ns.c('sessionSet', [key, value]);
		}
	}, true);
	ns.s('sessionId', function(){
		return getId(ns, config.quiet);
	}, true);
	ns.s('sessionDel', function(key){
		return del(ns, key, config.quiet);
	}, true);
	ns.s('sessionGet', function(key){
		return get(ns, key, config.quiet);
	}, true);
	ns.s('sessionSet', function(key, value){
		return set(ns, key, value, config.quiet);
	}, true);
	ns.s('sessionAuto', function(){
		return beginning(ns, config.quiet);
	}, true);
	ns.s('sessionDone', function(){
		return ending(ns, config.quiet);
	}, true);
	return Promise.resolve({session: config.enable===true});
};
module.exports.init = init;


var auto = function(ns, config){
	let result = Promise.resolve({session: config.enable===true}), resolve = function(){
		return result;
	};
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-session.auto', []);
	return (config.enable===true && config.auto===true) ? ns.c('sessionAuto').then(resolve) : result;
};
module.exports.auto = auto;


var done = function(ns, config){
	let result = Promise.resolve({session: config.enable===true}), resolve = function(){
		return result;
	};
	config.quiet ? 0 : ns.log('TRACE', 'engine.meta-session.done', []);
	return (config.enable===true && config.done===true) ? ns.c('sessionDone').then(resolve) : result;
};
module.exports.done = done;

