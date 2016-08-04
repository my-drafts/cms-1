'use strict';


var config = require('./config');
var logger = require('./logger');
var engines = require('./engines');
var http = require('http');


var optionsDefault = {
	port: 80,
	router: function(){}
};

var application = function(options){
	let o = Object.assign({}, optionsDefault, config, options);
	let handler = function(request, response){
		var ns = {
			request: request,
			response: response,
			log: logger
		};
		engines.init(ns)
			.then(function(){
				return engines.auto(ns);
			})
			.then(function(){
				return o.router();
			})
			.then(function(){
				return engines.done(ns);
			})
			.catch(function (error) {
				console.log(error);
				response.end('Error');
			});
	};
	var server = http.createServer(handler);
	server.listen(o.port);
};
module.exports.application = application;

