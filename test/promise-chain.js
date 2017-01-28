'use strict'

var chain = require('../app/lib/promise-chain');

var p1 = new Promise((resolve, reject) => {
	console.log('p1: 1');
	setTimeout(() => {
		console.log('p1: 2')
		resolve('x');
	}, 4000);
});

var p2 = new Promise((resolve, reject) => {
	console.log('p2: 1');
	setTimeout(() => {
		console.log('p2: 2')
		resolve('y');
	}, 2000);
});

var p3 = new Promise((resolve, reject) => {
	console.log('p3: 1');
	setTimeout(() => {
		console.log('p3: 2')
		resolve('z');
	}, 1000);
});

/*
Promise.resolve(p1).then(function(x){
	console.log(1);
});

p2.then(function(x){
	console.log(2);
});
*/

Promise.chain(p1, p2, p3);
/*.then((r)=>{
	console.log('then:', r);
}).catch((e)=>{
	console.log('catch: ', e);
});
*/