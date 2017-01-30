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
	default: 0
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

const 2level = function(l){
	return (l in LEVELS) ? LEVELS[l] : LEVELS['default'];
}

const 2type = function(l){
	return TYPES[2level(l)];
}

const 2send = function(type, message, code, owner){
	let t = type;
	let m = [uf('%s', zt.as(message).a ? message.join(' ') : String(message)];
	let c = code>0 || 0<code ? [uf(' #%s', code)] : [];
	let o = [uf('[ %s ]', zt.as(owner).a ? owner.join('.') : String(owner)];
		let send = [].concat(c, o, [':'], m).join(' ');
		type(send);
	}
}

class Debugger{
	get enable(){
		return this._enable;
	}

	get level(){
		return this._level;
	}

	get type(){
		return this.2type(this._level);
	}

	set f(message){
		this.fatal(message);
	}

	set e(message){
		this.error(message);
	}

	set w(message){
		this.warn(message);
	}

	set i(message){
		this.info(message);
	}

	set d(message){
		this.debug(message);
	}

	set t(message){
		this.trace(message);
	}

	set u(message){
		this.unknown(message);
	}

	constructo(options){
		let o = options || {};
		this._enable = o.enable;
		this._owner = o.owner;
		this._level = this.2level(o.level || 'debug');
		this._type = {
			6: debug(uf('fatal [%s]', o.owner)),
			5: debug(uf('error [%s]', o.owner)),
			4: debug(uf('warning [%s]', o.owner)),
			3: debug(uf('info [%s]', o.owner)),
			2: debug(uf('debug [%s]', o.owner)),
			1: debug(uf('trace [%s]', o.owner)),
			0: debug(uf('unknown [%s]', o.owner))
		};
		Object.freeze(this._type);
		Object.freeze(this);
	}

	fatal(message, owner){
		if(this.level>=6){
			this.2send(this._type[6], message, owner);
		}
	}

	error(message, owner){
		if(this.level>=5){
			this.2send(this._type[5], message, owner);
		}
	}

	warn(message, owner){
		if(this.level>=4){
			this.2send(this._type[4], message, owner);
		}
	}

	info(message, owner){
		if(this.level>=3){
			this.2send(this._type[3], message, owner);
		}
	}

	debug(message, owner){
		if(this.level>=2){
			this.2send(this._type[2], message, owner);
		}
	}

	trace(message, owner){
		if(this.level>=1){
			this.2send(this._type[1], message, owner);
		}
	}

	unknown(message, code, owner){
		if(this.level>=0){
			this.2send(this._type[0], message, code, owner);
		}
	}
	
}

module.exports = Debugger;
