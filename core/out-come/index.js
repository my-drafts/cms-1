'use strict';


var swig = require('swig');
var type = require('zanner-typeof'), of = type.of, is = type.is;
var uf = require('util').format;


/*
{
  cache: false,
  cache: 'memory',
  cache: {
    get: function(key){ ... },
    set: function(key, val){ ... }
  },
  locals: {},
  loader: swig.loaders.fs('./template', {encoding: 'utf8'}),
  loader: swig.loaders.memory({
    "layout": "{% block content %}{% endblock %}",
    "home.html": "{% extends 'layout.html' %}{% block content %}...{% endblock %}"
  })
}
*/
var optionsDefault = {
	cache: false,
	locals: {},
	loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
};
Object.freeze(optionsDefault);
var swigInstace = new swig.Swig(optionsDefault);

module.exports = function(logger){
	let oc = new outCome();
	oc.log = logger;
	Object.freeze(oc);
	return oc;
};


var outCome = function(){
	var blocks = {};
	this.blockGet = function(name){

	};
	this.blockSet = function(name, block, append){

	};
	this.swig = function(options){
		return options===undefined ? swigInstace : new swig.Swig(Object.assign({}, optionsDefault, options));
	};
};


