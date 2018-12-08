var app = require('../../routes/v1/tasks.js');

const PORT = process.env.PORT || 3000

const EXPECTED_TASK = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	id_type: expect.any(Number)
};

var taskId = null;
var request = require('supertest')('http://localhost:' + PORT);

describe('GET', () => {

	test('GET /tasks should return a list of tasks', () => {
		expect.assertions(2);

		return request.get('/api/tasks').then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXPECTED_TASK]));
		});
	});

	test('GET /tasks/1 should return task', () => {
		expect.assertions(2);

		return request.get('/api/tasks/1').then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_TASK));
		});
	});

	test('GET /tasks/1 should return task', () => {
		expect.assertions(2);

		return request.get('/api/tasks/1').then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_TASK));
		});
	});

	test('GET /tasks/25556 should return 404', () => {
		expect.assertions(1);

		return request.get('/api/tasks/25556').then(res => {
			expect(res.statusCode).toBe(404);
		});
	});

	test('GET /tasks/-10 with wrong id should return an error', () => {
		expect.assertions(1);

		return request.get('/api/tasks/-10').then(res => {
			expect(res.statusCode).toBe(404);
		});
	});
});

describe('POST', () => {
	test('POST /tasks with wrong data should return error', () => {
		expect.assertions(1);

		return request.post('/api/tasks', {
			ciao: 'mamma'
		}).then(res => {
			expect(res.statusCode).toBe(500);
		});
	});

	test('POST /tasks with right data should return an id', () => {
		expect.assertions(2);

		let task = {
				id_type: 2,
				text: "Sample question",
				choices: ["one", "two", "three"],
				points: 10,
				users: [{
					id_user: 1,
					owner: true,
					modifier: true
				}, {
					id_user: 3,
					owner: false,
					modifier: false
				}]
			},
			expected = {
				id: expect.any(Number)
			};

		return request.post('/api/tasks').send(task).then(res => {
			taskId = JSON.parse(res.text).id;
			console.log(taskId);
			expect(res.statusCode).toBe(201);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
		});
	});
});

describe('PUT', () => {

	var task = {
		id_type: 2,
		text: "Updated sample question",
		choices: ["one", "two", "three", "four"],
		points: 12,
		users: [{
			id_user: 1,
			owner: true,
			modifier: true
		}, {
			id_user: 3,
			owner: false,
			modifier: true
		}]
	};

	test('PUT /tasks/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.post('/api/tasks/4564225').send(task)
			.then(res => {
				expect(res.statusCode).toBe(404);
			});
	});

	test('PUT /tasks with right data should return an id', () => {
		expect.assertions(2);

		return request.put('/api/tasks/' + taskId).send(task)
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});
});

describe('DELETE', () => {
	test('DELETE /tasks/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.delete('/api/tasks/notanumber')
			.then(res => {
				expect(res.statusCode).toBe(500);
			});
	});

	test('DELETE /tasks/:id should delete a task', () => {
		expect.assertions(2);

		return request.delete('/api/tasks/' + taskId)
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});

	test('DELETE /tasks/:id with wrong id should return error', () => {
		expect.assertions(1);
		return request.delete('/api/tasks/' + taskId)
			.then(res => {
				expect(res.statusCode).toBe(404);
			});
	});
});