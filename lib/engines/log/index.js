'use strict';


var util = require('util');
var type = require('zanner-typeof'), of = type.of;


/*
*
*  +---+---+---------+-----------------------------------------------------------+
*  | L | N | Level   | Example                                                   |
*  +---+---+---------+-----------------------------------------------------------+
*  | F | 6 | Fatal   | Highest level: important stuff down                       |
*  | E | 5 | Error   | For example application crashes / exceptions.             |
*  | W | 4 | Warn    | Incorrect behavior but the application can continue       |
*  | I | 3 | Info    | Normal behavior like mail sent, user updated profile etc. |
*  | D | 2 | Debug   | Executed queries, user authenticated, session expired     |
*  | T | 1 | Trace   | Begin method X, end method X etc                          |
*  | U | 0 | Unknown | ?                                                         |
*  +---+---+---------+-----------------------------------------------------------+
*
* */

var LOG_MODE = 'DEBUG';
module.exports = function (level, message, code) {
	var n = __level2n(level), mode = __level2n(LOG_MODE);
	if (n>=mode) {
		console.log(__message2message(n, message, code));
	}
};


var __level2n = function (level) {
	switch (String(level).toLowerCase()) {
		case '6':
		case 'f':
		case 'fatal':
			return 6;
		case '5':
		case 'e':
		case 'error':
		case 'err':
			return 5;
		case '4':
		case 'w':
		case 'warning':
		case 'warn':
			return 4;
		case '3':
		case 'i':
		case 'information':
		case 'info':
			return 3;
		case '2':
		case 'd':
		case 'debug':
		case 'deb':
			return 2;
		case '1':
		case 't':
		case 'trace':
			return 1;
		default:
			return 0;
	}
};

var __n2level = function (letter) {
	switch (letter) {
		case 6:
			return 'Fatal';
		case 5:
			return 'Error';
		case 4:
			return 'Warning';
		case 3:
			return 'Information';
		case 2:
			return 'Debug';
		case 1:
			return 'Trace';
		case 0:
			return 'Unknown';
		default:
			return '?';
	}
};

var __message2message = function (n, message, code) {
	var l = __n2level(n);
	var m = of(message, 'array') && message.length>1 ? util.format('%s [%j]', message[0], message.slice(1)) : message;
	var c = code;
	return util.format.apply(null, c ? ['%s [%s]: %s.', l, c, m] : ['%s: %s.', l, m]);
};

