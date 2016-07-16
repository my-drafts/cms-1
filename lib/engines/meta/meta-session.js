'use strict';


var strong_store_cluster = require('strong-store-cluster');
var type = require('zanner-typeof'), of = type.of;


module.exports = function (nameSpace) {
	return new Promise(function (resolve, reject) {
		try {
			var ns = nameSpace;
			ns.log('TRACE', ['EngineMetaSession']);

			// session
			//
			ns.SESSION_NAME = ns.SESSION_NAME || 'sessionId'; // session-cookie-name
			Object.freeze(ns.SESSION_NAME);

			ns.SESSION_ID_LENGTH = ns.SESSION_ID_LENGTH || 16; // characters-length
			Object.freeze(ns.SESSION_ID_LENGTH);

			ns.SESSION_EXPIRES = ns.SESSION_EXPIRES || 10; // seconds-duration
			Object.freeze(ns.SESSION_ID_LENGTH);

			ns.SESSION_ID = false;
			ns.SESSION_DATA = {};

			ns.session = function (key, value) {
				ns.log('TRACE', ['EngineMetaSession.session', key, value]);
				var k = of(key, 'string') && key.trim() ? key.trim() : of(key, 'undefined') ? undefined : false, v = value;
				if (k===false) ;
				else if (k===undefined) return ns.SESSION_DATA;
				else if (v!==undefined) ns.SESSION_DATA[k] = v;
				else if (!(k in ns.SESSION_DATA)) ;
				else if (v===undefined) return ns.SESSION_DATA[k];
				else if (v===null) delete ns.SESSION_DATA[k];
				return undefined;
			};
			Object.freeze(ns.session);

			ns.sessionId = function () {
				ns.log('TRACE', ['EngineMetaSession.sessionId']);
				return ns.SESSION_ID;
			};
			Object.freeze(ns.sessionId);

			ns.sessionCommit = function () {
				ns.log('TRACE', ['EngineMetaSession.sessionCommit']);
				return new Promise(function (resolve, reject) {
					ns.log('DEBUG', ['EngineMetaSession.sessionCommit', ns.SESSION_ID, ns.SESSION_DATA, ns.SESSION_EXPIRES]);
					storeDataSetter(ns.SESSION_ID, ns.SESSION_DATA, ns.SESSION_EXPIRES).then(resolve, reject);
				});
			};
			Object.freeze(ns.sessionCommit);

			ns.sessionStart = function(){
				return new Promise(function (resolve, reject) {
					ns.log('TRACE', ['EngineMetaSession.sessionStart']);
					if (ns.SESSION_ID) {
						ns.log('DEBUG', ['EngineMetaSession.sessionStart started']);
						resolve(ns.SESSION_ID);
						return;
					}
					var id = ns.cookie(ns.SESSION_NAME);
					if (id) {
						ns.log('DEBUG', ['EngineMetaSession.sessionStart cookie', id]);
						storeIdChecker(id, ns.SESSION_EXPIRES).then(function (exists) {
							if (!exists) {
								ns.log('DEBUG', ['EngineMetaSession.sessionStart new', ns.SESSION_ID]);
								sessionStartNew(ns).then(resolve, reject);
								/*
								ns.cookie(ns.SESSION_NAME, '', { expires: -1 });
								Object.freeze(ns.SESSION_ID);
								reject('engineMetaSession: sessionStart with wrong sessionId in cookie');
								*/
							}
							else {
								storeDataGetter(id, ns.SESSION_EXPIRES).then(function (data) {
									ns.SESSION_ID = id;
									Object.freeze(ns.SESSION_ID);
									Object.assign(ns.SESSION_DATA, data);
									resolve(_id);
								}).catch(function () {
									ns.cookie(ns.SESSION_NAME, '', { expires: -1 });
									Object.freeze(ns.SESSION_ID);
									reject('engineMetaSession: sessionStart getting data');
								});
							}
						}).catch(reject);
					}
					else {
						ns.log('DEBUG', ['EngineMetaSession.sessionStart new', ns.SESSION_ID]);
						sessionStartNew(ns).then(resolve, reject);
					}
				});
			};
			Object.freeze(ns.sessionStart);

			resolve(ns);
			ns.log('TRACE', ['EngineMetaSession done']);
		}
		catch (error) {
			nameSpace.log('ERROR', ['EngineMetaSession', error]);
			reject('engineMetaSession: ' + error);
		}
	});
};


// generate Id
var generateId = function (length) {
	return Math.random().toString(36).substr(2).substr(0, Math.min(Math.max(length, 0), 16));
};

// generate unique Id
var generateUniqueId = function (length, checker, iteration) {
	return new Promise(function (resolve, reject) {
		var id = generateId(length);
		checker(id).then(function (exists) {
			if (!exists) {
				resolve(id);
			}
			else if (iteration > 10) {
				reject('engineMetaSession: to many iteration in generateUniqueId');
			}
			else {
				generateUniqueId(length, checker, (iteration || 0) + 1).then(resolve, reject);
			}
		}).catch(reject);
	});
};

var storeIdChecker = function (id, expires) {
	return new Promise(function (resolve, reject) {
		var collection = strong_store_cluster.collection('session-' + id);
		collection.configure({ expireKeys: expires });
		var key = 'created';
		collection.get(key, function(error, created) {
			if (error) {
				reject(error);
			}
			else if (!of(created, 'undefined')) {
				resolve(true);
			}
			else {
				collection.set(key, (new Date()).toUTCString(), function (error) {
					error ? reject(error) : resolve(false);
				});
			}
		});
	});
};

var storeDataGetter = function (id, expires) {
	return new Promise(function (resolve, reject) {
		var collection = strong_store_cluster.collection('session-' + id);
		collection.configure({ expireKeys: expires });
		var key = 'data';
		collection.get(key, function(error, data) {
			if (error) {
				reject(error);
			}
			else {
				resolve(JSON.parse(data));
			}
		});
	});
};

var storeDataSetter = function (id, value, expires) {
	return new Promise(function (resolve, reject) {
		var collection = strong_store_cluster.collection('session-' + id);
		collection.configure({ expireKeys: expires });
		var key = 'data';
		collection.set(key, JSON.stringify(value), function(error) {
			error ? reject(error) : resolve();
		});
	});
};

var sessionStartNew = function (ns) {
	var checker = function (_id) {
		return storeIdChecker(_id, ns.SESSION_EXPIRES);
	};
	return new Promise(function (resolve, reject) {
		generateUniqueId(ns.SESSION_ID_LENGTH, checker, 0).then(function (_id) {
			ns.cookie(ns.SESSION_NAME, _id, { siteOnly: true });
			ns.SESSION_ID = _id;
			Object.freeze(ns.SESSION_ID);
			resolve(_id);
		}, reject);
	});
};
