#!/usr/bin/env node
'use strict';


/* Logger * /
const logger = require('../lib/Logger');
//console.log(logger.init());
/**/

/* Config * /
const Cfg = require('../lib/Config');
const config = require('../config.json');
const cfg = Cfg.init(config)
//console.log(cfg);
console.log(cfg.get('app'));
/**/

/* transformation2index: request */
const r2i = require('../core/Thread/transformation2index/request2index');
const http = require('http');
http.createServer(function(req, res){
	//console.log(http.METHODS);
	//console.log(http.STATUS_CODES);
	//console.log(req);
	console.log(r2i(req));
}).listen(8080);
/**/