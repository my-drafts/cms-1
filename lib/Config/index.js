#!/usr/bin/env node
'use strict';

const zt = require('ztype');

const Debugable = require('../Debugable');
//const Debugger = require('../Debugger');

const normalize = function(config){
	let result = {};
	if(config instanceof Object){
		const f = function(result, keys, cfg, it){
			for(let key in cfg){
				let ac = zt.as(cfg[key]);
				if(ac.o) f(result, keys.concat([key]), cfg[key], it + 1);
				else result[keys.concat(key).join('.')] = cfg[key];
			}
		}
		f(result, [], config, 0);
	}
	return result;
}

class Config extends Debugable{
	get blocks(){ return this._all; }

	constructor(deb, config){
		super(deb, ['Config'], 'all', true);

		if(config instanceof Object){
			var all = Object.keys(config).map(function(block){
				return { [block]: normalize(config[block]) };
			});
			this._all = Object.assign.apply({}, all);
		}
		else{
			throw '[Config.constructor] Wrong config';
		}

		Object.freeze(this);
	}
	
	get(block, _default){
		this.trace('run', 'get');
		if(block && block in this._all){
			this.debug(['Block "%s"', block], 'get');
			return Object.assign({}, normalize(_default), this._all[block]);
		}
		else{
			throw this.error(['Block "%s"', block], 'get');
		}
	}

	set(block, value){
		this.trace('run', 'set');
		if(block && block in this._all){
			this.warn(['Block "%s" overwrite ', block], 'set');
			this._all[block] = Object.assign({}, this._all[block], normalize(value));
		}
		else if(block){
			this.debug(['Block "%s" write ', block], 'set');
			this._all[block] = normalize(value);
		}
		else{
			throw this.error(['Block "%s"', block], 'set');
		}
	}

	unset(block){
		this.trace('run', 'unset');
		if(block && block in this._all){
			this.debug(['Block "%s" delete ', block], 'unset');
			delete this._all[block];
		}
		else{
			throw this.error(['Block "%s"', block], 'unset');
		}
	}
}

module.exports = Config;
