'use strict';


var a = require('./../actions');
var url = require('url');


var optionsDefault = {
	enable: false,
	encoding: 'utf8',
	size: 1024*8, // 8kb
	amount: 8
};
var optionsMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	size: 'size', // number
	amount: 'amount' // number
};


var parser = function(data, options){
	let u = url.parse(new Buffer(data).toString(options.encoding), true);
	return {
		items: u.query,
		length: u.search.length-1
	};
};


var action = function(ns, options){
	let success = function(items){
		Object.assign(ns.GET, items);
		return true;
	};
	let unsuccess = function(error){
		return 'form-urlencoded GET: ' + error;
	};
	let o = Object.assign({}, optionsDefault, a.options4map(optionsMap, options));
	return o.enable!==true ? Promise.resolve(false) : a.data2parse(ns.request.url, parser, o).then(success, unsuccess);
};
module.exports = action;

