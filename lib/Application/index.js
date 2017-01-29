#!/usr/bin/env node
'use strict';

const cluster = require('cluster');
const debug = require('debug');
const os = require('os');
const process = require('process');
const log = debug('Application');
const osCPUs = os.cpus().length;
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
		this.pid = process.pid;
		Object.freeze(this);
	}

	cfg(block, key){
		log('[Application.cfg] run');
		return (key===undefined) ? this._config.get(block) : this._config.get(block)[key];
	}

	run(){
		if(cluster.isMaster){
			const amount = this.cfg('app')['core.amount'];
			const perCPU = this.cfg('app')['core.perCPU'];
			const workers = Math.max(1, Math.min(amount, perCPU*osCPUs));
			for(var worker=0; worker<workers; worker++){
				log(`[Application.run] worker ${worker} starting`);
				cluster.fork();
			}
			cluster.on('exit', function(worker, code, signal){
				log(`[Application.run] worker ${worker.process.pid} stoped`);
  		});
		}
		else{
			log(`[Application.run] worker ${this.pid} started`);
			
		}
	}
}

module.exports = Application;
