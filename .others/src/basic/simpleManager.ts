'use strict';

declare function require(path: string) : any;
var util = require('util');

export class simpleManager<T>{
	private storage: Array<T> = [];

	public get(index: number = 0): T{
		if(index in this.storage){
			return this.storage[index];
		}
		else{
			throw new TypeError('Error: manager index out of range');
		}
	}

	public set(value: T, index: number = -1){
		if(index in this.storage){

		}
	}
}
