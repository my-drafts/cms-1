'use strict';


var a = require('./actions');
var type = require('zanner-typeof'), of = type.of;
var optionSpaceMap = {
	enable: 'enable', // boolean
	encoding: 'encoding', // string:'utf8'
	size: 'size', // number
	amount: 'amount' // number
};


// text/plain
module.exports = function (nameSpace, optionSpace) {
	let ns = nameSpace;
	let os = optionSpace;
	let osm = optionSpaceMap;
	let o = {
		encoding: 'utf8',
		size: 1024 * 8, // 8kb
		amount: 8
	};
	let parser = function (data, options) {
		let d = new Buffer(data).toString(options.encoding);
		let items = {};
		let its = d.split(/[\r][\n]/i);
		its.forEach(function (item, index) {
			let it = /^([^\=]*)[\=](.*)$/.exec(item);
			let n = it[1];
			let v = it[2];
			items[n] = (items[n] || []).concat([v]);
		});
		return {
			items: items,
			length: data.length
		};
	};
	return new Promise (function (resolve, reject) {
		if (os && os.enable===true) {
			Object.assign(o, a.options4map(osm, os));
			let body = new Buffer('', o.encoding);
			ns.request.on('data', function (chunk) {
				body += chunk;
				if (o.size>0 && body.length>o.size) {
					ns.request.connection.destroy();
					reject('text/plain POST: too big size');
				}
			});
			ns.request.on('end', function () {
				try {
					let items = a.data2parse(body, parser, o);
					Object.assign(ns.POST, items);
					resolve(ns);
				}
				catch (error) {
					reject('text/plain POST: ' + error);
				}
			});
			ns.request.on('error', function (error) {
				reject('text/plain POST: ' + error);
			});
		}
		else {
			resolve(ns);
		}
	});
};

