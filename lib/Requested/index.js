#!/usr/bin/env node
'use strict';

const url = require('url');
const uf = require('util').format;
const zt = require('ztype');

const request2method = function(request, _default){
	_default = _default || '*';
	const _2method = function(m){
		return m.trim().toLowerCase();
	};
	let R = zt.al(request, { o:request, else: {} });
	let M = zt.al(R.method, { s:_2method, else:'' });
	let method = M.length>0 ? M : _default;
	return method;
};

const request2host = function(request, _default){
	_default = _default || '*';
	const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;
	const _2host = function(h){
		return h.trim().toLowerCase().replace(re, '$1');
	};
	let R = zt.al(request, { o:request, else: {} });
	let HH = zt.al(R.headers, { o:R.headers, else:{} });
	let H = zt.al(HH.host, { s:_2host, else:'' });
	let host = H.length>0 ? H : _default;
	return host;
};

const request2port = function(request, _default){
	_default = _default || '*';
	const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;
	const _2port = function(p){
		return p.trim().toLowerCase().replace(re, '$2');
	};
	let R = zt.al(request, { o:request, else: {} });
	let HH = zt.al(R.headers, { o:R.headers, else:{} });
	let P = zt.al(HH.host, { s:_2port, else:'' });
	let port = P.length>0 ? (Number(P)>0 ? Number(P) : P) : _default;
	return port;
};

const request2path = function(request, _default){
	_default = _default || '*';
	const ref = /^.+?[\.][^\.]+$/ig;
	const _2pm = function(path, index){
		return path.trim();
	};
	const _2pf = function(path, index){
		return path.length>0;
	};
	const _2p = function(p){
		return [].concat([''], p, p.length>0 && ref.test(p[p.length-1]) ? [] : ['']);
	};
	const _2path = function(p){
		return _2p(p.toLowerCase().split('/').map(_2pm).filter(_2pf));
	};
	let R = zt.al(request, { o:request, else:{} });
	let U = url.parse(R.url, true);
	let P = zt.al(U.pathname, { s:_2path, else:[] });
	let path = P.length>0 ? P.join('/') : _default;
	return path;
};

const request2query = function(request, _default){
	_default = _default || {};
	const _2query = function(q){
		return Object.assign({}, q);
	}
	let R = zt.al(request, { o:request, else:{} });
	let U = url.parse(R.url, true);
	let Q = zt.al(U.query, { o:_2query, else:{} });
	let query = Object.keys(Q).length>0 ? Q : _default;
	return query;
};

class Requested{
	get d(){ return this.dir; }
	get h(){ return this.host; }
	get f(){ return this.file; }
	get m(){ return this.method; }
	get p(){ return this.path; }
	get pp(){ return this.pathes; }
	get q(){ return this.query; }

	get dir(){ return this._dir; }
	get host(){ return this._host; }
	get file(){ return this._file; }
	get method(){ return this._method; }
	get path(){ return this._path; }
	get pathes(){ return this._path.replace(/^[\/](.*?)[\/]?$/, '$1').split('/'); }
	get port(){ return this._port; }
	get query(){ return this._query; }

	static init(request){
		return new Requested(request);
	}

	constructor(request){
		if(!zt.as(request).has('IncomingMessage')){
			throw 'wrong request';
		}
		else{
			//this._request = request;
		}
		const re = /^(.*[\/])([^\/]*)$/ig;
		this._host = request2host(request, '*');
		this._method = request2method(request, '*');
		this._path = request2path(request, '*');
		this._dir = this._path.replace(re, '$1');
		this._file = this._path.replace(re, '$2');
		this._port = request2port(request, '*');
		this._query = request2query(request, {});
		Object.freeze(this);
	}

	toString(){
		let q = Object.keys(this.q).length>0 ? uf(' %j', this.q) : '';
		return uf('[%s] %s:%s%s%s', this.m, this.h, this.port, this.p, q);
	}
}

module.exports = Requested;
