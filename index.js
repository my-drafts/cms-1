#!/usr/bin/env node
'use strict';

const Debugger = require('./lib/Debugger');
const Application = require('./lib/Application');
const app = new Application(require('./config.json'));
app.run();
