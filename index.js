'use strict';

const Application = require('./lib/Application');
const app = new Application(require('./config.json'));
app.run();
