'use strict';


var meta_accept = require('./meta-accept');
var meta_accept_encoding = require('./meta-accept-encoding');
var meta_accept_language = require('./meta-accept-language');
var meta_content_type = require('./meta-content-type');
var meta_cookie = require('./meta-cookie');
var meta_host = require('./meta-host');
var meta_method = require('./meta-method');
var meta_path = require('./meta-path');
var meta_port = require('./meta-port');
var meta_session = require('./meta-session');
var meta_status_code = require('./meta-status-code');
var meta_status_message = require('./meta-status-message');
var meta_user_agent = require('./meta-user-agent');


module.exports = function (nameSpace) {
	return new Promise (function (resolve, reject) {
		nameSpace.log('TRACE', ['EngineMeta']);
		Promise.all([
			meta_accept(nameSpace),
			meta_accept_encoding(nameSpace),
			meta_accept_language(nameSpace),
			meta_content_type(nameSpace),
			meta_cookie(nameSpace),
			meta_host(nameSpace),
			meta_method(nameSpace),
			meta_path(nameSpace),
			meta_port(nameSpace),
			meta_session(nameSpace),
			meta_status_code(nameSpace),
			meta_status_message(nameSpace),
			meta_user_agent(nameSpace)
		]).then(function () {
			nameSpace.sessionStart().then(function () {
				// action
				//
				//var ACTION = [];
				//var action = ns.action = function (a) {};

				resolve(true);
				nameSpace.log('TRACE', ['EngineMeta done']);
			}).catch(function (error) {
				nameSpace.log('ERROR', ['EngineMeta', error]);
				reject('engineMeta: ' + error);
			});


		}).catch(function (error) {
			nameSpace.log('ERROR', ['EngineMeta', error]);
			reject('engineMeta: ' + error);
		});
	});
};
