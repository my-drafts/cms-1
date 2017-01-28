'use strict';

const debug = require('debug');
const log = debug('Config');
const uf = require('util').format;

class Config{
	get blocks(){
		log('[Config.blocks:get] run');
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

	cfg(block, value){
		log('[Config.cfg] run');
		if(value===null && block){
			delete this._all[block];
		}
		else if(value!==undefined && block){
			this._all[block] = Config.norm(value);
		}
		else if(value===undefined && block in this._all){
			return this._all[block];
		}
		else{
			throw uf('[Config.cfg]: Block "%s"', block);
		}
	}
}

module.exports = Config;
