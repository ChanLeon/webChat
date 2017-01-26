fis.config.set('roadmap.domain',
	process.env.NODE_ENV == 'development' ?
	'http://127.0.0.1:3600' : 'http://mongo_test');