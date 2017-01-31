'use strict';


var of = require('zanner-typeof');


var akeys = function(O){
	return Object.keys(O);
};
module.exports.akeys = akeys;


var alength = function(O, key){
	return of(O[key], 'array') ? O[key].length : -1;
};
module.exports.alength = alength;


var aitem = function(O, key, index){
	let L = alength(O, key);
	if(L===1){
		return O[key][0];
	}
	else if(L>1){
		return of(index, 'number') ? O[key][((index%L)+L)%L] : O[key];
	}
	else{
		throw 'Error [EngineData]: Unknown in item';
	}
};
module.exports.aitem = aitem;


var awalk = function(O, walk){
	let result = [];
	for(let key in O){
		let length = alength(O, key);
		for(let i = 0; i<length; i++){
			let item = O[key][i];
			if(of(walk, 'function')){
				let iresult = walk(item, i, key);
				if(!of(iresult, 'undefined')){
					item = iresult;
				}
			}
			result.push(item);
		}
	}
	return result;
};
module.exports.awalk = awalk;


var aitems = function(O, key){
	if(of(key, 'string')){
		let walk = function(item, index, field){
			return item[key];
		};
		return awalk(O, walk);
	}
	else if(of(key, 'array')){
		let walk = function(item, index, field){
			let result = {};
			for(var i = 0; i<key.length; i++){
				result[key[i]] = item[key[i]];
			}
			return result;
		};
		return awalk(O, walk);
	}
	else{
		return awalk(O);
	}
};
module.exports.aitems = aitems;


var afitem = function(O, filter, key, index){
	let result = aitem(O, key, index ? index : 0);
	if(of(filter, 'array')){
		for(let i = 0; i<filter.length; i++){
			result = result[filter[i]];
		}
	}
	else{
		result = result[filter];
	}
	return result;
};
module.exports.afitem = afitem;


var options4map = function(map, space){
	let result = {}, s = space;
	for(var m in map){
		if(s && (m in s)){
			result[map[m]] = space[m];
		}
	}
	return result;
};
module.exports.options4map = options4map;


var data2parse = function(data, parser, options){
	let body = parser(data, options);
	if(options.size>0 && body.length>options.size){
		return Promise.reject('too long size');
	}
	else if(options.amount>0 && Object.keys(body.items)>options.amount){
		return Promise.reject('too many amount');
	}
	else{
		return Promise.resolve(body.items);
	}
};
module.exports.data2parse = data2parse;

