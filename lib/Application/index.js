#!/usr/bin/env node
'use strict';

const cluster = require('cluster');
const os = require('os');
const process = require('process');
const zt = require('ztype');

const Debugger = require('../Debugger');
const Config = require('../Config');
//const Core = require('../Core');

const osCPUs = os.cpus().length;

class Application{
	get deb(){ return this._debugger; }

	constructor(deb, config){
		if(zt.as(deb).f){
			this._debugger = deb.init({ level: 'all', owner: 'Application' });
		}
		else{
			throw '[Application.init] Wrong debugger';
		}

		if(config instanceof Config){
			this._config = config;
		}
		else{
			throw '[Application.init] Wrong config';
		}

		this.pid = process.pid;
		Object.freeze(this);
	}

	cfg(block, key){
		this.deb.trace('run', 'cfg');
		return (key===undefined) ? this._config.get(block) : this._config.get(block)[key];
	}

	run(){ 
		if(cluster.isMaster){
			const amount = this.cfg('app')['core.amount'];
			const perCPU = this.cfg('app')['core.perCPU'];
			const workers = Math.max(1, Math.min(amount, perCPU*osCPUs));
			for(var worker=0; worker<workers; worker++){
				this.deb(`[Application.run] worker ${worker} starting`);
				cluster.fork();
			}
			cluster.on('exit', function(worker, code, signal){
				this.deb(`[Application.run] worker ${worker.process.pid} stoped`);
  		});
		}
		else{
			this.deb(`[Application.run] worker ${this.pid} started`);
			
		}
	}
}

module.exports = Application;
