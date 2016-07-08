'use strict';

var http = require('http');
var post = require('../../lib/engines/post');

http.createServer(function(request, response){
	var ns = {
		request: request,
		response: response
	};
	post(ns).then(function (post){
		if (post) {
			//console.log(ns);
			//console.log(ns.request.headers);
			console.log(ns.POST);
			//console.log(ns.FILE);
			//console.log(ns.posts());
			//console.log(ns.post('t3'));
			//console.log(ns.post('t2.2'));
			//console.log(ns.fileObjects());
			//console.log(ns.files(['path', 'size']));
			ns.fileClean();
			response.end('OK');
		}
		else if (ns.request.url==='/m') {
			let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form method="post" enctype="multipart/form-data">\
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
		else if (ns.request.url==='/u') {
			let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form method="post" enctype="application/x-www-form-urlencoded">\
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
		else if (ns.request.url==='/t') {
			let html = '\
<!DOCTYPE html>\
<html>\
	<head>\
		<meta charset="UTF-8">\
		<title>Document</title>\
	</head>\
	<body>\
		<form method="post" enctype="text/plain">\
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
		else if (ns.request.url==='/j') {
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
				type: "POST",\
				url: "serverUrl",\
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
		<form method="post" enctype="application/json" onsubmit="s(this); return false;">\
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

