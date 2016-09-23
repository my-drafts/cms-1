'use strict';


var uf = require('util').format;
var type = require('zanner-typeof'), of = type.of;


var core = require('../../core');
var app = core.application;
var fs = require('fs');


var router = function(){
	if(ns.path()=='/favicon.ico'){
		response.end();
		return;
	}
	//console.log(ns.ACCEPT);
	//console.log(ns.ACCEPT_ENCODING);
	//console.log(ns.ACCEPT_LANGUAGE);
	console.log(ns.COOKIE);
	console.log('sessionId: '+ns.sessionId());
	ns.cookie('q1', 'v1', {session: true});
	ns.cookie('q2', 'v2', {expires: 2*60*1000, sameSite: true});
	ns.cookie('q3', 'v3', {expires: 3*60*1000, sameSite: true});
	ns.cookieDone();
	ns.sessionCommit();
	//console.log(ns.contentType());
	//console.log(ns.host());
	//console.log(ns.method());
	//console.log(ns.path());
	//console.log(ns.port());
	//console.log(ns.statusCode());
	//console.log(ns.statusMessage());
	//console.log(ns.userAgent());
	if(ns.request.url.match(/^[\/]upload/i)){
		ns.uploading({}).then(function(post){
			if(post){
				//console.log(ns);
				//console.log(ns.request.headers);
				//console.log(ns.PATH);
				//console.log(ns.GET);
				//console.log(ns.POST);
				//console.log(ns.FILE);
				//console.log(ns.posts());
				//console.log(ns.post('t3'));
				//console.log(ns.post('t2.2'));
				//console.log(ns.fileObjects());
				//console.log(ns.files(['path', 'size']));
				ns.uploadClean();
				response.end('OK');
			}
			else{
				response.end('?');
			}
		});
	}
	else if(ns.request.url.match(/^[\/]m/i)){
		response.write(fs.readFileSync('./m.html'));
	}
	else if(ns.request.url.match(/^[\/]u/i)){
		response.write(fs.readFileSync('./u.html'));
	}
	else if(ns.request.url.match(/^[\/]t/i)){
		response.write(fs.readFileSync('./t.html'));
	}
	else if(ns.request.url.match(/^[\/]j/i)){
		response.write(fs.readFileSync('./j.html'));
	}
	else{
		response.write('x');
	}
	return Promise.resolve({router: true});
};


app();

