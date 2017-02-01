#!/usr/bin/env node
'use strict';

const logger = require('../lib/Logger');
//console.log(logger.init());

const Cfg = require('../lib/Config');
const config = require('../config.json');
const cfg = Cfg.init(config)
//console.log(cfg);
console.log(cfg.get('app'));
