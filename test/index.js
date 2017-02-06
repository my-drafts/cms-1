#!/usr/bin/env node
'use strict';

const uf = require('util').format;

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
const red = require('../lib/Requested');
const zt = require('ztype');
const http = require('http');
http.createServer(function(req, res){
	//console.log(http.METHODS);
	//console.log(http.STATUS_CODES);
	//console.log(req);
	console.log(uf('%s', red.init(req)), red.init(req));
	//console.log(zt.as(req).has('IncomingMessage'));
	//console.log(zt.as(res));
}).listen(8080);
/**/
''.toLowerCase()