'use strict';
//var core = require('./core/core');

var p1 = function(x, y){
	return new Promise(function(resolve, reject){
		x ? reject(x) : resolve(y);
	});
};

/*
p1(null, 123)
	.then(function(a){
		console.log(a);
		return 234;
	})
	.then(function(a){
		console.log(a);
		throw 1;
		return 345;
	})
	.then(function(a){
		console.log(a);
		return 456;
	})
	.then(function(a){
		console.log(a);
		return 567;
	})
	.then(function(a){
		console.log(a);
	})
	.catch(function(a){
		console.log('err: ', a);
	});
/** /

var request = {1:'f1-1'}, response = {1:'f1-2'}, space = {1:'f1-3'};
Promise
	.all([
		(function(a, b, c){
			return new Promise(function(resolve, reject){
				console.log('1: ', arguments);
				resolve('f1-result: ' + a + '+' + b + '+' + c);
			});
		})(request, response, space),
		new Promise(function(resolve, reject){
			console.log('2: ', arguments);
			resolve('f2-result');
		}),
		new Promise(function(resolve, reject){
			console.log('3: ', arguments);
			resolve('f3-result');
		})
	])
	.then(function(a){
		console.log('ok: ', arguments);
	})
	.catch(function(a){
		console.log('err: ', a);
	});
/**/

var p1 = new Promise(function(resolve, reject) {
	console.log('p1-1: ' + Date.now());
	setTimeout(function(){
		console.log('p1-2: ' + Date.now());
		resolve('p1-2: ' + Date.now());
	}, 500);
});
var p2 = new Promise(function(resolve, reject) {
	console.log('p2-1: ' + Date.now());
	setTimeout(function(){
		console.log('p2-2: ' + Date.now());
		resolve('p2-2: ' + Date.now());
	}, 100);
});

Promise.all([p1, p2]).then(function(value) {
	console.log(value); // "два"
	// Оба вернули resolve, однако p2 вернул результат первым
});

