#!/usr/bin/env node
'use strict';

const Debugger = require('../Debugger')('Config', );
const deb = new Debugger('Config', Debugger.2level());
const uf = require('util').format;

class Config{
	get blocks(){
		deb.debug('run', '', 'blocks:get');
		return this._all;
	}

	constructor(config){
		log('[Config.constructor] run');
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
		log('[Config.norm] run');
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

	get(block, default){
		log('[Config.get] run');
		if(block && block in this._all){
			log(uf('[Config.get] Block "%s"', block));
			return Object.assign({}, Config.norm(default), this._all[block]);
			return this._all[block];
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
