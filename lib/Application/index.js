'use strict';

const debug = require('debug');
const log = debug('Application');
const Config = require('../Config');
//const Core = require('../Core');

class Application{
	constructor(config){
		log('[Application.constructor] run');
		if(config instanceof Object){
			this._config = new Config(config);
		}
		else{
			throw '[Application.init] Wrong config';
		}
		Object.freeze(this);
	}

	cfg(block, value){
		log('[Application.cfg] run');
		if(value===undefined){
			return this._config.cfg(block);
		}
		else{
			this._config.cfg(block, value);
		}
	}

	run(){
		var cfg = this.cfg('app');
		var amount = cfg['core.amount'];
		console.log(amount);
	}
}

module.exports = Application;
