#!/usr/bin/env node
'use strict';

const uf = require('util').format;
const zt = require('ztype');

const Debugger = require('../Debugger');

class Config{
	get blocks(){
		deb.debug('run', '', 'blocks:get');
		return this._all;
	}

	get deb(){ return this._debugger; }

	constructor(deb, config){
		if(zt.as(deb).f){
			this._debugger = deb.init({ level: 'all', owner: 'Application' });
		}
		else{
			throw '[Config.constructor] Wrong debugger';
		}

		if(config instanceof Object){
			var all = Object.keys(config).map(function(block){
				return { [block]: Config.norm(config[block]) };
			});
			this._all = Object.assign.apply({}, all);
		}
		else{
			throw '[Config.constructor] Wrong config';
		}

		Object.freeze(this);
	}
	
	static norm(config){
		if(config instanceof Object){
			var result = {};
			const f = function(keys, cfg, it){
				for(var key in cfg){
					if(cfg[key] instanceof Array) result[keys.concat(key).join('.')] = cfg[key];
					else if(cfg[key] instanceof Object) f(keys.concat([key]), cfg[key], it + 1);
					else result[keys.concat(key).join('.')] = cfg[key];
				}
			}
			f([], config, 0);
			return result;
		}
		else{
			return {};
		}
	}

	get(block, _default){
		this.deb.trace('run', 'get');
		if(block && block in this._all){
			this.deb.trace(uf('Block "%s"', block), 'get');
			return Object.assign({}, Config.norm(_default), this._all[block]);
		}
		else{
			throw uf('[Config.get]: Block "%s"', block);
		}
	}

	set(block, value){
		log('[Config.set] run');
		if(block && block in this._all){
			log(uf('[Config.set] Block "%s" overwrite ', block));
			this._all[block] = Object.assign({}, this._all[block], Config.norm(value));
		}
		else if(block){
			log(uf('[Config.set] Block "%s" write ', block));
			this._all[block] = Config.norm(value);
		}
		else{
			throw uf('[Config.set]: Block "%s"', block);
		}
	}

	unset(block){
		log('[Config.unset] run');
		if(block && block in this._all){
			delete this._all[block];
		}
		else{
			throw uf('[Config.unset]: Block "%s"', block);
		}
	}
}

module.exports = Config;
