#!/usr/bin/env node
'use strict';

const Debugger = require('./lib/Debugger');
const D = Debugger.init({ level: 'all', owner: ['/'] });

D.trace('creating Config');
const Config = require('./lib/Config');
const cfg = new Config(Debugger, require('./config.json'));
D.trace('created Config');

D.trace('creating Application');
const Application = require('./lib/Application');
const app = new Application(Debugger, cfg);
D.trace('created Application');

D.trace('runing Application');
app.run();
D.trace('runed Application');
