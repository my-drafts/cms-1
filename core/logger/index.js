'use strict';


var config = require('./config');
var util = require('util');
var type = require('zanner-typeof'), of = type.of;


module.exports = function (level, service, message, code) {
	if (config.enable===true) {
		let l = __level2property(level, 'code', -1);
		let mode = __level2property(config.mode, 'code', -1);
		if (l>=mode) {
			let msg = __message(level, service, message, code);
			console.log(msg);
		}
	}
};


var __level2property = function (level, propertyName, defaultValue) {
	level = String(level);
	// config.case
	if (config.case==='lower') {
		level = level.toLowerCase();
	}
	else if (config.case==='upper') {
		level = level.toUpperCase();
	}
	// config.mods
	let result = defaultValue;
	for (let m in config.modes) {
		if (result!==defaultValue) break;
		let mode = config.modes[m];
		let property = mode[propertyName];
		for (let a in mode.alias) {
			if (level===mode.alias[a]) {
				result = property;
				break;
			}
		}
	}
	return result;
};

var __message = function (level, service, message, code) {
	let l = __level2property(level, 'title', '?');
	let s = service;
	let m = of(message, 'array') ? message[0] : message;
	let mm = of(message, 'array') ? util.format(' [%j]', message.slice(1)) : '';
	let c = code ? util.format(' [%s]', code) : '';
	return util.format('%s(%s)%s: %s%s.', l, s, c, m, mm);
};

