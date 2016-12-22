'use strict';

var http = require('http');
var config = require('./config');
var core = require('../../lib/core');

module.exports = function(httpOptions){
	var server = http.createServer(function(request, response){
		var nameSpace = {
			config: {},
			request: request,
			response: response
		};
		var promises = [
			core(nameSpace)
		];
		Promise
			.all(promises)
			.then(function(){

			})
			.catch(function(){

			});
	});
};