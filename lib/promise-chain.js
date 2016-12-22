'use strict'

var one = function(f){
	if(typeof f=='function'){
		return new Promise(f);
	}
	else if(f instanceof Promise){
		return f;
	}
	else{
		return Promise.resolve(f);
	}
}

var run = function(){
	let a = arguments;
	if(a.length>0){
		return new Promise((resolve, reject)=>{
			one(a[0]).then((v0)=>{
				if(a.length>1){
					let a1 = [].slice.call(a, 1);
					chain.apply(null, a1).then((v1)=>{
						resolve([v0].concat(v1));
					}, reject);
				}
				else{
					resolve(v0);
				}
			}, reject);
		});
	}
	else{
		return Promise.resolve();
	}
}

var chain = function(){
	return Promise.resolve().then(()=>{
		return run.apply(null, arguments);
	});
}
module.exports = Promise.__proto__.chain = chain;
