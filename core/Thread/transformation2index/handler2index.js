#!/usr/bin/env node
'use strict';

const http = require('http');
const util = require('util');
const zt = require('ztype');

const options2method = function(options){
	let o = options || {};
	let m = zt.as(o.method).s ? o.method.toLocaleLowerCase() : false;
	return m && http.METHODS.indexOf(m.toUpperCase())>=0 ? m : '*';
};

const options2host = function(options){
	let o = options || {};
	let h = zt.as(o.host).s ? o.host.toLocaleLowerCase() : false;
	return h && h.length>0 ? h.replace(/^([^\:]+)(?:[\:]([\d]+))?$/ig, '$1') : '*';
};

const options2port = function(options){
	let o = options || {};
	let zo = {
		s: function(p){
			return Number(p.replace(/^([^\:]+)[\:]([\d]+)$/ig, '$2'));
		},
		n: o.port,
		else: false
	};
	let p = zt.al(o.port, zo);
	return p && p>0 ? p : 80;
};

const options2path = function(options){
	let o = options || {};
	let p = zt.as(o.path).a ? o.path : [];
	return p.join('/').toLocaleLowerCase().split('/');
};

const handler2index = function(options){
	let method = options2method(options);
	let host = options2host(options);
	let port = options2port(options);
	let path = options2path(options);
	let index = util.format('%s: %s:%s/%s', method, host, port, path.join('/'));
	return index;
};

module.exports = handler2index;