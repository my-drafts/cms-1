#!/usr/bin/env node
'use strict';

const logger = require('../lib/Logger');
console.log(logger.init());

const cfg = require('../lib/Config');
console.log(cfg.init());