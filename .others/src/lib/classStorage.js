'use strict';

const classAbstract = require('./classAbstract');
var type = require('ztype'), of = type.of, is = type.is, like = type.like, ofs = type.ofs;
var util = require('util');


class classStorage extends classAbstract {
	constructor(){
		super();
		let key = this._dataKey = Symbol();
		let data = this[key] = {};
	}

	data(key, value){
		let data = this[this._dataKey];
		if(arguments.length>1) data[key] = value;
		return (key in data) ? data[key] : undefined;
	}


}
module.exports = classStorage;

var storage = function(){
	var data = {};

	this.get = function(index){
		return (index in data) ? data[index] : undefined;
	};

	this.set = function(value, index){
		if(of(value, ['undefined', 'null'])){
			// delete
			if(index in data){
				delete data[index];
				return true;
			}
			else return false;
		}
		else if(index in data){
			// overwrite
		}
		else if(of(index, ['string', 'number'])){
			// create
		}
		else{
			// append
		}
	};

};
