'use strict';

var config = require('./config');
var logger = require('./logger');
var engines = require('./engines');
var nameSpace = require('./name-space');
var outCome = require('./out-come');
var http = require('http');


var optionsDefault = {
	port: 80
};
Object.freeze(optionsDefault);
var options = Object.assign({}, optionsDefault);
var oc = outCome(logger);
var router = function(ns){
	return new Promise(function(resolve, reject){
		resolve('test!');
	});
};

var application = function(_options){
	let o = Object.assign({}, optionsDefault, config, _options);
	let handler = function(request, response){
		let ns = nameSpace(request, response, logger, oc);
		engines
			.handler(ns, router(ns))
			.then(function(out){
				console.log('out: ', out);
				response.end(out);
			})
			.catch(function(error){
				console.log('error: ', error);
				response.end('Error');
			});
	};
	var server = http.createServer(handler);
	server.listen(o.port);
};

module.exports.application = application;

