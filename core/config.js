
module.exports.db = {
	enable: true,
	url: 'mongodb://localhost:27017/test',
	connect:{
		db:{
			wtimeout: 5
		},
		replset:{},
		mongos:{},
		server:{
			autoReconnect: true
		}
	}
};

module.exports.post = {
	autoFields: true,
	autoFiles: true,
	enable: true,
	encoding: 'utf8',
	maxFieldsSize: 16777216,
	maxFields: 1000,
	maxFilesSize: 'Infinity',
	uploadDir: 'tmp/upload'
};

module.exports.language = {
	enable: true,
	default: 'uk',
	languages: ['en', 'uk', 'ru']
};

module.exports.redirects = [
	{
		code: 301,
		replace: '/',
		matched: [
			'^[\\/]index(?:[\\.](?:html|php|asp))?$'
		]
	}
];