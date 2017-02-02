#!/usr/bin/env node
'use strict';

const Logger = require('./lib/Logger');
const Loptions = { enable: true, level: 'all', owner: ['/'] };
const L = Logger.init(Loptions);

L.trace('creating Config');
const Config = require('./core/Config');
const config = require('./config.json');
const cfg = Config.init(config);
L.trace('created Config');

L.trace('creating Application');
const Application = require('./core/Application');
const app = Application.init(cfg);
L.trace('created Application');

L.trace('runing Application');
app.run();
L.trace('runed Application');
  