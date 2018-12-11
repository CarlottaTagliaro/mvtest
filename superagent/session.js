const request = require('superagent');

const authority = 'localhost:3000';
const path = '/api/';

request
	.post(authority + path + 'session')
	.send({
		id: 3,
		pwd: 'banana'
	})
	.end((err, res) => {
		console.log('post');
		console.log(res.statusCode);
		console.log(res.body);
	});

request
	.post(authority + path + 'session')
	.send({
		id: 7,
		pwd: 'banana'
	})
	.end((err, res) => {
		console.log('post');
		console.log(res.statusCode);
		console.log(res.body);
	});

request
	.get(authority + path + 'session')
	.end((err, res) => {
		console.log('get');
		console.log(res.statusCode);
		console.log(res.body);
	});
