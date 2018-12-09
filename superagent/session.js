const request = require('superagent');

const authority = 'localhost:3000';
const path = '/api/';

request
	.get(authority + path + 'session')
	.end((err, res) => {
	});

request
	.post(authority + path + 'session')
	.send({ user:
	        {
		        email: 'user@testing.com',
		        name: 'Testing User'
	        }
	      })
	.then(res => {
		alert('yay got ' + JSON.stringify(res.body));
	});
