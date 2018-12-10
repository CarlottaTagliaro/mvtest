const EXPECTED_REVIEW = {
	id: expect.any(Number),
	mark: expect.any(Number),
	comment: expect.any(String),
	id_creator: expect.any(Number),
	id_submission: expect.any(Number)
};

const ASSIGN_ID = 1;
const SESSION_USER = 1;

var reviewId = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
	test('POST /reviews with wrong data should return error', () => {
		expect.assertions(1);

		return request.post(`/api/assignments/${ASSIGN_ID}/submissions/reviews`, {
			ciao: 'mamma'
		}).then(res => {
			expect(res.statusCode).toBe(500);
		});
	});

	test('POST /reviews with right data should return an id', () => {
		expect.assertions(2);

		let review = {
				mark: 9,
				comment: "Well done",
				id_assign: ASSIGN_ID,
				id_user: 1,
				id_task: 1
			},
			expected = {
				id: expect.any(Number)
			};

		return request.post(`/api/assignments/${ASSIGN_ID}/submissions/reviews`)
			.send({
				sessionUser: SESSION_USER,
				payload: review
			}).then(res => {
				reviewId = JSON.parse(res.text).id;

				expect(res.statusCode).toBe(201);
				expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
			});
	});
});

describe('GET', () => {
	test('GET /reviews should return a list of reviews', () => {
		expect.assertions(2);

		return request.get(`/api/assignments/${ASSIGN_ID}/submissions/reviews`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXPECTED_REVIEW]));
			});
	});

	test('GET /reviews/:id should return a review', () => {
		expect.assertions(2);

		return request.get(`/api/assignments/${ASSIGN_ID}/submissions/reviews/${reviewId}`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_REVIEW));
			});
	});

	test('GET /reviews/25556 should return 404', () => {
		expect.assertions(1);

		return request.get(`/api/assignments/${ASSIGN_ID}/submissions/reviews/25556`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => expect(res.statusCode).toBe(404));
	});

	test('GET /reviews/-10 with wrong id should return an error', () => {
		expect.assertions(1);

		return request.get(`/api/assignments/${ASSIGN_ID}/submissions/reviews/-10`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => expect(res.statusCode).toBe(404));
	});
});

describe('PUT', () => {
	var review = {
		mark: 2,
		comment: "Terrible",
		id_submission: 1
	}

	test('PUT /reviews/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.post(`/api/assignments/${ASSIGN_ID}/reviews/1323231`)
			.send({
				sessionUser: SESSION_USER,
				payload: review
			})
			.then(res => expect(res.statusCode).toBe(404));
	});

	test('PUT /reviews with right data should return an id', () => {
		expect.assertions(2);

		return request.put(`/api/assignments/${ASSIGN_ID}/submissions/reviews/${reviewId}`)
			.send({
				sessionUser: SESSION_USER,
				payload: review
			})
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});
});

describe('DELETE', () => {
	test('DELETE /reviews/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.delete(`/api/assignments/${ASSIGN_ID}/submissions/reviews/-23`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => expect(res.statusCode).toBe(404));
	});

	test('DELETE /reviews/:id should delete a review', () => {
		expect.assertions(2);

		return request.delete(`/api/assignments/${ASSIGN_ID}/submissions/reviews/${reviewId}`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});

	test('DELETE /reviews/:id with wrong id should return error', () => {
		expect.assertions(1);
		return request.delete(`/api/assignments/${ASSIGN_ID}/submissions/reviews/${reviewId}`)
			.send({
				sessionUser: SESSION_USER
			})
			.then(res => expect(res.statusCode).toBe(404));
	});
});