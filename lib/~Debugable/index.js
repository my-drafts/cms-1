#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const Debugger = require('../Debugger');

class Debugable{
	get deb(){ return this._debugger; }
	get debugger(){ return this._Debugger; }

	set f(message){ this.deb.f = message; }
	set e(message){ this.deb.e = message; }
	set w(message){ this.deb.w = message; }
	set i(message){ this.deb.i = message; }
	set d(message){ this.deb.d = message; }
	set t(message){ this.deb.t = message; }
	set u(message){ this.deb.u = message; }

	constructor(deb, owner, level, enable){
		if(zt.as(deb).f){
			this._Debugger = deb;
			let options = { enable: enable, level: level, owner: owner };
			this._debugger = deb.init(options);
		}
		else{
			throw '[Debugable.constructor] Wrong debugger';
		}
	}

	build(message, owner){ return this.deb.build(message, owner); }
	fatal(message, owner){ return this.deb.fatal(message, owner); }
	error(message, owner){ return this.deb.error(message, owner); }
	warn(message, owner){ return this.deb.warn(message, owner); }
	info(message, owner){ return this.deb.info(message, owner); }
	debug(message, owner){ return this.deb.debug(message, owner); }
	trace(message, owner){ return this.deb.trace(message, owner); }
	unknown(message, owner){ return this.deb.unknown(message, owner); }
}

module.exports = Debugable;
