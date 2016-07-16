'use strict';


var http = require('http');
var log = require('../../lib/engines/log');
var meta = require('../../lib/engines/meta');
var get = require('../../lib/engines/get');
var post = require('../../lib/engines/post');

http.createServer(function(request, response){
	var ns = {
		request: request,
		response: response,
		log: log,
		SESSION_NAME: 'session',
		SESSION_ID_LENGTH: 8,
		SESSION_EXPIRES: 600
	};

	Promise
		.all([
			get(ns),
			meta(ns),
			post(ns)
		])
		.then(function (){
			if (ns.path()=='/favicon.ico') {
				response.end();
				return;
			}
			//console.log(ns.ACCEPT);
			//console.log(ns.ACCEPT_ENCODING);
			//console.log(ns.ACCEPT_LANGUAGE);
			console.log(ns.COOKIE);
			console.log('sessionId: ' + ns.sessionId());
			ns.cookie('q1', 'v1', { session: true });
			ns.cookie('q2', 'v2', { expires: 2*60*1000, sameSite: true });
			ns.cookie('q3', 'v3', { expires: 3*60*1000, sameSite: true });
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
			if (ns.request.url.match(/^[\/]upload/i)){
				ns.uploading({}).then(function (post){
					if (post) {
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
					else {
						response.end('?');
					}
				});
			}
			else if (ns.request.url.match(/^[\/]m/i)) {
				let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form action="/upload" method="post" enctype="multipart/form-data">\
			<p>\
				<input type="text" name="t3" placeholder="t3"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
			</p>\
			<p>\
				<input type="file" name="f4" multiple><br />\
				<input type="file" name="f3"><br />\
				<input type="file" name="f2.2"><br />\
				<input type="file" name="f2.2" multiple><br />\
				<input type="file" name="f1"><br />\
				<input type="file" name="f1" multiple><br />\
				<input type="file" name="f1"><br />\
			</p>\
			<input type="submit" >\
		</form>\
	</body>\
</html>';
				response.end(html);
			}
			else if (ns.request.url.match(/^[\/]u/i)) {
				let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form action="/upload" method="post" enctype="application/x-www-form-urlencoded">\
			<p>\
				<input type="text" name="t3" placeholder="t3"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
			</p>\
			<input type="submit" >\
		</form>\
	</body>\
</html>';
				response.end(html);
			}
			else if (ns.request.url.match(/^[\/]t/i)) {
				let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form action="/upload?x=y" method="post" enctype="text/plain">\
			<p>\
				<input type="text" name="t3" placeholder="t3"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
			</p>\
			<input type="submit" >\
		</form>\
	</body>\
</html>';
				response.end(html);
			}
			else if (ns.request.url.match(/^[\/]j/i)) {
				let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<script src="https://code.jquery.com/jquery-1.11.3.js"></script>\
	<script type="text/javascript">\
		function s (o) {\
			$.ajax({\
				type: o.method,\
				url: o.actions,\
				data: JSON.stringify($(o).serializeArray()),\
				success: function () {\
					alert(1);\
				},\
				dataType: "json",\
				contentType : "application/json"\
			});\
		};\
	</script>\
	<body>\
		<form action="/upload" method="post" enctype="application/json" onsubmit="s(this); return false;">\
			<p>\
				<input type="text" name="t3" placeholder="t3"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t2.2" placeholder="t2"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
				<input type="text" name="t1" placeholder="t1"><br />\
			</p>\
			<input type="submit" >\
		</form>\
	</body>\
</html>';
				response.end(html);
			}
			else {
				let html = 'x';
				response.end(html);
			}
		})
		.catch(function (error) {
			console.log(error);
			response.end('Error');
		});
}).listen(3333);

