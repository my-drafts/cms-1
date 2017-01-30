
'use strict';

const debug = require('debug');
const type = require('ztype');

const LEVELS = {
	6: 6, f: 6, fatal: 6,
	5: 5, e: 5, error: 5, err: 5,
	4: 4, w: 4, warning: 4, warn: 4,
	3: 3, i: 3, information: 3, info: 3, inf: 3,
	2: 2, d: 2, debug: 2, deb: 2,
	1: 1, t: 1, trace: 1,
	0: 0, u: 0, unknown: 0
};
const TYPES = {
	6: "fatal",
	5: "error",
	4: "warning",
	3: "information",
	2: "debug",
	1: "trace",
	0: "unknown"
};

class Debugger{
	constructor(options){
		this._enable = options.enable;
		this._mode = options.mode;
		this._types = TYPES;
		
	}
	
	static _level(level){
		const l = String(level).toLowerCase();
		return (l in LEVELS) ? LEVELS[l] : LEVELS[0];
	}

	static _type(level){
		return (level in TYPES) ? TYPES[l] : TYPES[0];
	}

	static _debugger(mode, level, message, code, owner){
		let l = Debugger._level(level);
		let m = Debugger._level(mode);
		if (l>=m) {
				let l = Debugger._level(l);
				let o = owner || '?';
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

			
			
			let msg = concatMessage(level, service, message, code);
			console.log(msg);
		}
	}

	}
	
	info(){
		
	}

	fatal(){
	}
	
	error(){
	}

	warning(){
	}
	
	information(){
	}
	
	debug(){
	}
	
	trace(){
	}
	
	unknown(){
	}	
}


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

