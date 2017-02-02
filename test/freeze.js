#!/usr/bin/env node

var a = {
	b: {
		bb: 1
	},
	c: Number(2)
};

Object.freeze(a);
console.log(a);
a.b.bb = 2;
console.log(a);
a.c = 22;
console.log(a);
a.d = 24;
console.log(a);

