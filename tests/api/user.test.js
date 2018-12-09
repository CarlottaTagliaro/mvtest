const EXPECTED_USER = {
	id: expect.any(Number),
	email: expect.any(String),
	name: expect.any(String)
};

var userId = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
	test('POST /users with wrong data should return error', () => {
		expect.assertions(1);

		return request.post('/api/users', {
			ciao: 'mamma'
		}).then(res => {
			expect(res.statusCode).toBe(500);
		});
	});

	test('POST /users with right data should return an id', () => {
		expect.assertions(2);

		let user = {
				email: "user@testing.com",
				name: "Testing User"
			},
			expected = {
				id: expect.any(Number)
			};

		return request.post('/api/users').send(user).then(res => {
			userId = JSON.parse(res.text).id;
			expect(res.statusCode).toBe(201);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
		});
	});
});

describe('GET', () => {
	test('GET /users should return a list of users', () => {
		expect.assertions(2);

		return request.get('/api/users').then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXPECTED_USER]));
		});
	});

	test('GET /users/:id should return a user', () => {
		expect.assertions(2);

		return request.get('/api/users/' + userId).then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_USER));
		});
	});

	test('GET /users/25556 should return 404', () => {
		expect.assertions(1);

		return request.get('/api/users/25556').then(res => {
			expect(res.statusCode).toBe(404);
		});
	});

	test('GET /users/-10 with wrong id should return an error', () => {
		expect.assertions(1);

		return request.get('/api/users/-10').then(res => {
			expect(res.statusCode).toBe(404);
		});
	});
});

describe('PUT', () => {

	var user = {
		email: "user@testing.com",
		name: "Testing User"
	};

	test('PUT /users/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.post('/api/users/4564225').send(user)
			.then(res => {
				expect(res.statusCode).toBe(404);
			});
	});

	test('PUT /tasks with right data should return 204', () => {
		expect.assertions(2);

		return request.put('/api/users/' + userId).send(user)
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});
});

describe('DELETE', () => {
	test('DELETE /users/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.delete('/api/user/notanumber')
			.then(res => {
				expect(res.statusCode).toBe(500);
			});
	});

	test('DELETE /users/:id should delete a task', () => {
		expect.assertions(2);

		return request.delete('/api/users/' + userId)
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});

	test('DELETE /users/:id with wrong id should return error', () => {
		expect.assertions(1);
		return request.delete('/api/users/' + userId)
			.then(res => {
				expect(res.statusCode).toBe(404);
			});
	});
});