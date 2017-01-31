#!/usr/bin/env node
'use strict';

const debug = require('debug');
const uf = require('util').format;
const zt = require('ztype');

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

const _2send = function(level, message, owner, D){
	let l = _2level(level);
	if(!D.enable || l<D.level) return;
	let o = [D._owner].concat(zt.al(owner, { a:o=>o, s:o=>[o], else:[] }));
	let send = _2build(message, o);
	D._types[l](send);
	return send;
}

class _Debugger{
	get enable(){ return this._enable; }
	get level(){ return this._level; }
	get owner(){ return this._owner; }
	get type(){ return this._type; }

	constructor(options){
		let o = options || {};
		this._enable = o.enable || true;
		this._level = _2level(o.level || 'all');
		this._owner = zt.al(o.owner, { a:o=>o.join('.'), s:o=>o, else:'?' });
		this._type = _2type(this._level);
		this._types = Object.keys(TYPES).map(function(index){
			return debug(TYPES[index]);
		});
		Object.freeze(this._types);
		Object.freeze(this);
	}

	build(message, owner){ return _2build(message, owner); }
	fatal(message, owner){ return _2send(6, message, owner, this); }
	error(message, owner){ return _2send(5, message, owner, this); }
	warn(message, owner){ return _2send(4, message, owner, this); }
	info(message, owner){ return _2send(3, message, owner, this); }
	debug(message, owner){ return _2send(2, message, owner, this); }
	trace(message, owner){ return _2send(1, message, owner, this); }
	unknown(message, owner){ return _2send(0, message, owner, this); }
}

class Debugger extends _Debugger{
	set f(message){ this.fatal(message); }
	set e(message){ this.error(message); }
	set w(message){ this.warn(message); }
	set i(message){ this.info(message); }
	set d(message){ this.debug(message); }
	set t(message){ this.trace(message); }
	set u(message){ this.unknown(message); }

	constructor(options){
		super(options);
	}

	static init(options){
		return new Debugger(options);
	}
}

module.exports = Debugger;
