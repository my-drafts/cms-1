'use strict';

const config = require('./config.json');
const App = require('./lib/app');
const Cfg = require('./lib/config');

const cfg = Cfg(config);
const app = App(cfg);

app.run();
