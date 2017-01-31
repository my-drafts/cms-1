#!/usr/bin/env node
'use strict';

const debug = require('debug');
const uf = require('util').format;
const zt = require('ztype');

const cfg = require('./cfg.json');

const LEVELS = {
	6: 6, f: 6, fatal: 6,
	5: 5, e: 5, error: 5, err: 5,
	4: 4, w: 4, warning: 4, warn: 4,
	3: 3, i: 3, information: 3, info: 3, inf: 3,
	2: 2, d: 2, debug: 2, deb: 2,
	1: 1, t: 1, trace: 1,
	0: 0, u: 0, unknown: 0,
	all: 0,
	default: 0
};

const TYPES = {
	6: 'fatal',
	5: 'error',
	4: 'warning',
	3: 'information',
	2: 'debug',
	1: 'trace',
	0: 'unknown',
};

const _2level = function(l){
	return (l in LEVELS) ? LEVELS[l] : LEVELS['default'];
}

const _2type = function(l){
	return TYPES[_2level(l)];
}

const _2owner = function(owner, _default){
	let a = function(o){
		return o;
	}
	let s = function(o){
		return [o];
	}
	return zt.al(owner, { a: a, s: s, else: _default });
}

const _2build = function(message, owner){
	let ma = function(m){
		if(m.length>0 && /[\%][\w]/.test(m)){
			return uf.apply(null, m);
		}
		else{
			return m.join(' ');
		}
	}
	let ms = function(m){
		return m;
	}
	let m = zt.al(message, { a: ma, s: ms, else: '' });
	let o = owner.length>0 ? [uf('[ %s ]:', owner.join('.'))] : [];
	return [].concat(o, m).join(' ');
}

const _2send = function(level, message, owner, T){
	let l = _2level(level);
	if(!T.enable || l<T.level) return;
	let o = [].concat(T._owner, _2owner(owner, []));
	let send = _2build(message, o);
	T._types[l](send);
	return send;
}

class Logger{
	get enable(){ return this._enable; }
	get level(){ return this._level; }
	get owner(){ return this._owner.join('.'); }

	constructor(options){
		let logger = this;
		let o = options || {};
		this._enable = o.enable || cfg.enable;
		this._level = _2level(o.level || cfg.level);
		this._owner = _2owner(o.owner, []);
		this._types = Object.keys(TYPES).map(function(level){
			return debug(TYPES[level]);
		});
		/**/
		Object.keys(TYPES).forEach(function(level){
			logger[TYPES[level]] = function(message, owner){
				return _2send(level, message, owner, logger);
			}
		});
		/** /
		Object.keys(LEVELS).forEach(function(type){
			let level = _2level(type);
			logger[type] = function(message, owner){
				return _2send(level, message, owner, logger);
			}
		});
		/**/
		Object.freeze(this._types);
		Object.freeze(this);
	}

	static init(options){
		return new Logger(options);
	}

	build(message, owner){ return _2build(message, owner); }
}

module.exports = Logger;
