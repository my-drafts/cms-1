'use strict';


var of = require('zanner-typeof').of;

var value2case = function(config, value, defaultValue){
	if(config.enable!==true){
		return defaultValue;
	}
	else if (!of(value, 'string')){
		return defaultValue;
	}
	switch(config.case){
		case 'lower':
			return value.toLowerCase();
		case 'upper':
			return value.toUpperCase();
		default:
			return value;
	}
};
module.exports.value2case = value2case;
