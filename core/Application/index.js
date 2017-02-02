#!/usr/bin/env node
'use strict';

const cluster = require('cluster');
const os = require('os');
const process = require('process');
const zt = require('ztype');

const Config = require('../Config');
const Logger = require('../../lib/Logger');
//const Thread = require('../Thread');

const Loptions = {};
const L = Logger.init(Loptions);
const osCPUs = os.cpus().length;


//const Debugable = require('../Debugable');
//const Debugger = require('../Debugger');


class Application{
	constructor(config){
		super(deb, ['Application'], 'all', true);

		if(config instanceof Config){
			this._config = config;
		}
		else{
			throw '[Application.constructor] Wrong config';
		}

		this.pid = process.pid;
		Object.freeze(this);
	}

	cfg(block, key){
		this.trace('run', 'cfg');
		return (key===undefined) ? this._config.get(block) : this._config.get(block)[key];
	}

	run(){ 
		this.trace('run', 'run');
		if(cluster.isMaster){
			this.debug(['master id:%s started', this.pid], 'run');
			const cfg = this.cfg('app');
			const amount = cfg['core.amount'];
			const perCPU = cfg['core.perCPU'];
			const workers = Math.max(1, Math.min(amount, perCPU*osCPUs));
			for(var worker=0; worker<workers; worker++){
				this.debug(['worker #%s starting', worker], 'run');
				cluster.fork();
			}
			cluster.on('exit', function(worker, code, signal){
				this.debug(['worker id:%s stoped', worker.process.pid], 'run');
  		});
		}
		else{
			this.debug(['worker id:%s started', this.pid], 'run');
			//new Core(this)
		}
	}

	static init(config){
		return new Application(config);
	}
}

module.exports = Application;
