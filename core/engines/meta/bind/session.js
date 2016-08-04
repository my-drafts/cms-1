'use strict';


var a = require('./../lib/actions');
var type = require('zanner-typeof'), of = type.of;


var sessionOptionsDefault = {
	idName: 'session',
	idLength: 8,
	expires: 240
};


var init = function (ns, config) {
	ns.log('TRACE', 'engine::meta', ['accept init']);
	Object.assign(sessionOptionsDefault, config);
	Object.freeze(sessionOptionsDefault);
	// session-cookie-id-name
	//ns.SESSION_NAME = sessionOptionsDefault.idName;
	//Object.freeze(ns.SESSION_NAME);
	// session-cookie-id-length
	//ns.SESSION_ID_LENGTH = sessionOptionsDefault.idLength;
	//Object.freeze(ns.SESSION_ID_LENGTH);
	// session-cookie-id-expires
	//ns.SESSION_EXPIRES = sessionOptionsDefault.expires;
	//Object.freeze(ns.SESSION_EXPIRES);
	ns.SESSION_ID = false;
	ns.SESSION_DATA = {};
	if (config.enable!==true) {
		Object.freeze(ns.SESSION_ID);
		Object.freeze(ns.SESSION_DATA);
	}
};
module.exports.init = init;


var get = function (ns) {
	ns.log('TRACE', 'engine::meta', ['session init']);
	ns.session = function (key, value) {
		ns.log('DEBUG', 'engine::meta', ['call session', key, value]);
		let k = key || '';
		let v = value;
		let result;
		if (key===undefined) {
			result = ns.SESSION_DATA;
		}
		else if (v===null) {
			delete ns.SESSION_DATA[k];
		}
		else if (v!==undefined) {
			ns.SESSION_DATA[k] = v;
		}
		else if (k in ns.SESSION_DATA) {
			result = ns.SESSION_DATA[k];
		}
		ns.log('DEBUG', 'engine::meta', ['called session', result]);
		return result;
	};
	Object.freeze(ns.session);
};
module.exports.session = get;


var getId = function (ns) {
	ns.log('TRACE', 'engine::meta', ['sessionId init']);
	ns.sessionId = function () {
		ns.log('DEBUG', 'engine::meta', ['call sessionId']);
		let result = ns.SESSION_ID;
		ns.log('DEBUG', 'engine::meta', ['called sessionId', result]);
		return result;
	};
	Object.freeze(ns.sessionId);
};
module.exports.sessionId = getId;


var done = function (ns) {
	ns.log('TRACE', 'engine::meta', ['sessionDone init']);
	let expires = sessionOptionsDefault.expires;
	ns.sessionDone = function () {
		let id = ns.SESSION_ID;
		let data = ns.SESSION_DATA;
		ns.log('DEBUG', 'engine::meta', ['call sessionDone', id, data, expires]);
		let result = new Promise(function (resolve, reject) {
			a.storeDataSetter(id, data, expires).then(resolve, reject);
		});
		ns.log('DEBUG', 'engine::meta', ['called sessionDone', result]);
		return result;
	};
	Object.freeze(ns.sessionDone);
};
module.exports.sessionDone = done;


var start = function (ns) {
	ns.log('TRACE', 'engine::meta', ['sessionStart init']);
	let name = sessionOptionsDefault.idName;
	let length = sessionOptionsDefault.idLength;
	let expires = sessionOptionsDefault.expires;
	let sessionIdSet = function (id) {
		ns.log('DEBUG', 'engine::meta', ['call sessionStart id set', id]);
		ns.SESSION_ID = id;
		Object.freeze(ns.SESSION_ID);
		return id;
	};
	let sessionDataSet = function (data) {
		ns.log('DEBUG', 'engine::meta', ['call sessionStart data set', data]);
		Object.assign(ns.SESSION_DATA, data);
		return data;
	};
	let sessionCookieSet = function (id, expires) {
		ns.log('DEBUG', 'engine::meta', ['call sessionStart cookie set', id, expires]);
		ns.cookie(name, id, { siteOnly: true, expires: expires });
		return id;
	};
	let sessionNew = function () {
		ns.log('DEBUG', 'engine::meta', ['sessionStart new']);
		let checker = function (id) {
			return a.storeIdChecker(id, expires);
		};
		return a.generateUniqueId(length, checker)
			.then(function (id) {
				ns.log('DEBUG', 'engine::meta', ['called sessionStart new generateUniqueId', id]);
				return id;
			})
			.then(sessionCookieSet)
			.then(sessionIdSet);
	};
	let sessionRenew = function (id) {
		/*
		 // sessionStart with wrong sessionId in cookie
		 sessionCookieSet('', -1);
		 sessionIdSet(false);
		 */
		ns.log('DEBUG', 'engine::meta', ['sessionStart renew', id]);
		return Promise.resolve(id)
			.then(sessionCookieSet)
			.then(sessionIdSet);
	};
	let sessionDataGet = function (id) {
		ns.log('DEBUG', 'engine::meta', ['sessionStart get data', id]);
		return a.storeDataGetter(id, expires)
			.then(function (data) {
				sessionIdSet(id);
				sessionDataSet(data);
				return id;
			})
			.catch(function (error) {
				sessionCookieSet('', -1);
				sessionIdSet(false);
				return 'sessionStart getting data';
			});
	};
	ns.sessionStart = function () {
		let id = ns.SESSION_ID;
		let data = ns.SESSION_DATA;
		ns.log('TRACE', 'engine::meta', ['call sessionStart']);
		return Promise.resolve(id)
			.then(function (id) {
				console.log(1);
				if (id) {
					ns.log('DEBUG', 'engine::meta', ['sessionStart twice', id]);
					return id;
				}
				else {
					return false;
				}
			})
			.then(function (id) {
				console.log(2);
				if (id) {
					return id;
				}
				else {
					id = ns.cookie(name);
					if (id) {
						ns.log('DEBUG', 'engine::meta', ['sessionStart from cookie', id]);
						return a.storeIdChecker(id, expires)
							.then(function (r) {
								if (r.exists) {
									ns.log('DEBUG', 'engine::meta', ['sessionStart from cookie', id]);
									return sessionDataGet(r.id);
								}
								else {
									ns.log('DEBUG', 'engine::meta', ['sessionStart from cookie renew', id]);
									return sessionRenew(r.id);
								}
							});
					}
					else {
						return false;
					}
				}
			})
			.then(function (id) {
				console.log(3);
				if (id) {
					return id;
				}
				else {
					return sessionNew(name, length, expires);
				}
			});
	};
	Object.freeze(ns.sessionStart);
};
module.exports.sessionStart = start;


var auto = function (ns, config) {
	ns.log('TRACE', 'engine::meta', ['sessionAuto init']);
	ns.sessionAuto = function (options) {
		ns.log('TRACE', 'engine::meta', ['call sessionAuto']);
		options = Object.assign({}, config, options);
		return options.enable===true ? ns.sessionStart() : Promise.resolve(false);
	};
	Object.freeze(ns.sessionAuto);
};
module.exports.sessionAuto = auto;

