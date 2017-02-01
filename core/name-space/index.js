'use strict';


var type = require('zanner-typeof'), of = type.of;
var uf = require('util').format;


module.exports = function(request, response, logger, outCome){
	let ns = new nameSpace();
	ns.request = request;
	ns.response = response;
	ns.log = logger;
	ns.out = outCome;
	Object.freeze(ns);
	return ns;
};


var nameSpace = function(){
	let storage = {}, freeze = [], THIS = this;
	this.c = function(key, args, argThis){
		try{
			return caller(storage, key, args, argThis);
		}
		catch (error){
			THIS.log('ERROR', 'name-space.c', [uf('key %s', key), error]);
			return undefined;
		}
	};
	this.f = function(key){
		return freezer(freeze, storage, key);
	};
	this.g = function(key){
		try{
			return getter(storage, key);
		}
		catch (error){
			THIS.log('FATAL', 'name-space.g', [uf('key %s', key), error]);
			return undefined;
		}
	};
	this.s = function(key, value, freezing){
		try{
			setter(freeze, storage, key, value);
			(freezing===true) ? THIS.f(key) : 0;
			return true;
		}
		catch (error){
			if(/[\s]freezed$/i.test(error)){
				THIS.log('ERROR', 'name-space.s', ['overwriting key denied', key]);
				return false;
			}
			else{
				THIS.log('WARNING', 'name-space.s', ['overwrite key', key]);
				storage[key] = value;
				(freezing===true) ? THIS.freeze(key) : 0;
				return true;
			}
		}
	};
	this.__store = function(){
		return storage;
	};
	this.__freeze = function(){
		return freeze;
	};
};


var caller = function(object, key, args, argThis){
	return getter(object, key).apply(argThis, args);
};
var freezer = function(freeze, storage, key){
	if(of(key, 'string') && (key in storage) && (freeze.indexOf(key)===-1)){
		freeze.push(key);
		return true;
	}
	return false;
};
var getter = function(object, key){
	if(key in object){
		return object[key];
	}
	else{
		throw new Error('name-space.getter key not exists');
	}
};
var setter = function(freeze, object, key, value){
	if(freeze.indexOf(key)!==-1){
		throw 'name-space.setter key freezed';
	}
	else if(key in object){
		throw 'name-space.setter key overwriting';
	}
	else{
		object[key] = value;
	}
};