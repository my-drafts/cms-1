'use strict'

var chain = require('../app/lib/promise-chain');
/*
var p1 = (resolve, reject) => {
	console.log('p1: 1');
	resolve('x');
};

var p2 = (resolve, reject) => {
	console.log('p2: 1');
	resolve('y');
};

var p3 = (resolve, reject) => {
	console.log('p3: 1');
	resolve('z');
};
*/

var p1 = (resolve, reject) => {
	console.log('p1: 1');
	setTimeout(() => {
		console.log('p1: 2')
		resolve('x');
	}, 4000);
};

var p2 = (resolve, reject) => {
	console.log('p2: 1');
	setTimeout(() => {
		console.log('p2: 2')
		resolve('y');
	}, 2000);
};

var p3 = (resolve, reject) => {
	console.log('p3: 1');
	setTimeout(() => {
		console.log('p3: 2')
		resolve('z');
	}, 1000);
};

var f = function(){
	let a = arguments;
	console.log('f: ', a);
}

chain(p1, p2, p3).then(f);
console.log('!');