'use strict';

const debug = require('debug');
const log = debug('Application');
const Config = require('../Config');
//const Core = require('../Core');

class Application{
	constructor(){
		log('[Application.constructor] run');
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

	init(config){
		log('[Application.init] run');
		if(config instanceof Config){
			this._config = config;
		}
		else{
			throw '[Application.init] Wrong config';
		}
	}

	run(){
		var cfg = this.cfg('app');
		var amount = cfg['core.amount'];
		console.log(amount);
	}
}

module.exports = Application;
