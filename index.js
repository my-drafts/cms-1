'use strict';

const Config = require('./lib/Config');
const config = require('./config.json');
const cfg = new Config();
cfg.blocks = config;

const Application = require('./lib/Application');
const app = new Application();
app.init(cfg);
app.run();
