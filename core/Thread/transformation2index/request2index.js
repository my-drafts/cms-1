#!/usr/bin/env node
'use strict';

const http = require('http');
const path = require('path');
const url = require('url');
const util = require('util');

const handler2index = require('./handler2index');

const request2index = function(request){
	if(request instanceof http.IncomingMessage){
		let H = request.headers;
		let U = url.parse(request.url, true);
		let P = U.pathname.toLocaleLowerCase();
		//
		let m = request.method;
		let h = 'host' in H ? H.host : 'localhost';
		let p = P.split('/').map(function(path, index){
			return path.trim();
		}).filter(function(path, index){
			return path.length>0;
		}); //.join('/').replace(/^(.*)$/ig, '/$1');
		let q = Object.assign({}, U.query);
		console.log(m);
		console.log(h);
		console.log('"' + p + '"');
		console.log(q);

		return handler2index('%s: %s/%s', m, h, p.join('/'));

	}
	else{
		throw '[/core/Thread/transformation2index/request2index] wrong request';
	}
};

module.exports = request2index;
