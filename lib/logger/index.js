'use strict';


var config = require('./config');
var uf = require('util').format;
var type = require('zanner-typeof'), of = type.of;


var level2property = function (level, propertyName, defaultValue) {
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
var concatMessage = function (level, service, message, code) {
	let l = level2property(level, 'title', '?');
	let s = of(service, 'string') ? service : '?';
	let m = '';
	if(of(message, 'string')){
		m = uf(': %s%s', message, '');
	}
	else if(of(message, 'array') && message.length>0){
		m = of(message[0], 'string') ? uf('%s', message[0]) : '';
		let mm = message.length>1 ? uf(' %j', message.slice(1)) : '';
		m = uf(': %s%s', m, mm);
	}
	let c = of(code, 'number') ? uf(' [%s]', code) : '';
	return uf('%s(%s)%s%s.', l, s, c, m);
};


module.exports = function (level, service, message, code) {
	if (config.enable===true) {
		let l = level2property(level, 'code', -1);
		let mode = level2property(config.mode, 'code', -1);
		if (l>=mode) {
			let msg = concatMessage(level, service, message, code);
			console.log(msg);
		}
	}
};

