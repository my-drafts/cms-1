'use strict';

var type = require('ztype'), of = type.of, is = type.is, like = type.like, ofs = type.ofs;
var util = require('util');

var manager = function(){
	var storage = {};

	this.get = function(index){
		return (index in storage) ? storage[index] : undefined;
	};

	this.set = function(value, index){
		if(of(value, ['undefined', 'null'])){
			// delete
			if(index in storage){
				delete storage[index];
				return true;
			}
			else return false;
		}
		else if(index in storage){
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
