const db = require('./connection.js');

const functions = ['getAll', 'create', 'delete'];

const SUBMISSIONS = [{
	id: expect.any(Number),
	time: expect.any(Date),
	answer: expect.any(String),
	id_assign: expect.any(Number),
	id_user: expect.any(Number),
	id_task: expect.any(Number)
}];

var subId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.exam[method]).toBeDefined();
	}
});

test('GET /api/assignments/:id/submissions - get all submissions', () => {
	expect.assertions(1);
	return expect(db.submission.getAll(1)).resolves.toEqual(expect.arrayContaining(SUBMISSIONS));
});

test('POST /api/assignments/:id/submissions - creates a submission and returns its id', () => {
	expect.assertions(1);

	let submission = {
			answer: 'The answer is none of them',
			id_user: 3,
			id_task: 4
		},
		expected = {
			id: expect.any(Number)
		};

	return db.submission.create(2, submission).then((res) => {
		console.log('CREATE RETURNS', res)
		subId = res.id;
		expect(res).toMatchObject(expected);
	});
});

test('POST /api/assignments/:id/submissions - error if user is not in the class', () => {
	expect.assertions(1);

	let submission = {
		answer: 'The answer is none of them',
		id_user: 10,
		id_task: 2
	};

	return expect(db.submission.create(1, submission)).rejects.toBeInstanceOf(Error);
});

test('POST /api/assignments/:id/submissions - error if task is not in the exam', () => {
	expect.assertions(1);

	let submission = {
		answer: 'The answer is none of them',
		id_user: 3,
		id_task: 32
	};

	return expect(db.submission.create(1, submission)).rejects.toBeInstanceOf(Error);
});

test('POST /api/assignments/:id/submissions - error if parameter is of wrong type', () => {
	expect.assertions(1);

	let submission = {
		answer: 'The answer is none of them',
		id_user: 'topolino',
		id_task: 2
	};

	return expect(db.submission.create(1, submission)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/assignments/:id/submissions - deletes all submission of a certain user and assignment', () => {
	expect.assertions(1);

	return expect(db.submission.delete(2, 3)).resolves.toBeUndefined();
});

test('DELETE /api/exams/:id - error if parameter is a string', () => {
	expect.assertions(1);

	return expect(db.submission.delete('string', 3)).rejects.toBeInstanceOf(Error);
});

afterAll(() => {
	console.warn("Closing DB");
	db.close();
});