'use strict';

//const core = require('../core');

class Application{
	constructor(cfg){
		if(cfg instanceof Config){
			this._cfg = cfg;
		}
		else{
			throw '[Application.constructor] Wrong cfg';
		}
	}
	
	
	
	
}

module.exports = Application;