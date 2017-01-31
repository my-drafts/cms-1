#!/usr/bin/env node
'use strict';

const zt = require('ztype');
const L = require('../Logger').init({ enable: true, level: 'all', owner: ['Config'] });

//const Debugable = require('../Debugable');
//const Debugger = require('../Debugger');

const cfg2flat = function(cfg){
	let result = {};
	if(zt.as(cfg).o){
		const flat = function(result, keys, cfg, it){
			for(let key in cfg){
				let ac = zt.as(cfg[key]);
				if(!ac.o) result[keys.concat(key).join('.')] = cfg[key];
				else flat(result, keys.concat([key]), cfg[key], it + 1);
			}
		}
		f(result, [], cfg, 0);
	}
	return result;
}

class Config{
	get blocks(){ return this._all; }

	constructor(config){
		if(zt.as(config).o){
			var all = Object.keys(config).map(function(block){
				return { [block]: cfg2flat(config[block]) };
			});
			this._all = Object.assign.apply({}, all);
		}
		else{
			throw L.error('Wrong config', 'constructor');
		}

		Object.freeze(this);
	}
	
	get(block){
		L.trace('run', 'get');
		if(block && block in this._all){
			L.debug(['Block "%s"', block], 'get');
			return Object.assign({}, this._all[block]);
		}
		else{
			throw L.error(['Block "%s"', block], 'get');
		}
	}

	set(block, value){
		L.trace('run', 'set');
		if(block && block in this._all){
			L.warn(['Block "%s" overwrite ', block], 'set');
			this._all[block] = Object.assign({}, this._all[block], cfg2flat(value));
		}
		else if(block){
			L.debug(['Block "%s" write ', block], 'set');
			this._all[block] = cfg2flat(value);
		}
		else{
			throw L.error(['Block "%s"', block], 'set');
		}
	}

	unset(block){
		L.trace('run', 'unset');
		if(block && block in this._all){
			L.debug(['Block "%s" delete ', block], 'unset');
			delete this._all[block];
		}
		else{
			throw L.error(['Block "%s"', block], 'unset');
		}
	}

	flat(cfg){ return cfg2flat(cfg); }

	static init(config){
		return new Config(config);
	}
}

module.exports = Config;
