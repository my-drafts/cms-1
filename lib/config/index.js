'use strict'

const debug = require('debug');
const type = require('ztype');
const uf = require('util').format;

class Config{

	static norm(cfg, it){

	}

	get block(){
		return this._all;
	}

	set block(config){
		if(config instanceof Object){
			this._all = Object(this._all, cfg);
		}
	}

	constructor(cfg){
		this._all = {};
		this.cfg = cfg;
	}
	
	block(block){
		if(block in this._all){
			return this._all[block];
		}
		else{
			throw uf('[Config.block]: Block "%s" not found', block);
		}
	}
}

module.exports = new Config();
