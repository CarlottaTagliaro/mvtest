const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const EXAMS = [{
	id: expect.any(Number),
	id_creator: expect.any(Number)
}];

const singleExam = {
	id_creator: expect.any(Number),
	tasks: expect.any(Array)
}

var examId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.exam[method]).toBeDefined();
	}
});

test('GET /api/exams - get all exams', () => {
	expect.assertions(1);
	return expect(db.exam.getAll()).resolves.toEqual(expect.arrayContaining(EXAMS));
});

test('POST /api/exams - creates an exam and returns its id', () => {
	expect.assertions(1);

	let exam = {
			id_creator: 2,
			tasks: [1, 2, 3]
		},
		expected = {
			id: expect.any(Number)
		};

	//expect.assertions(1);
	return db.exam.create(exam).then((res) => {
		console.log('CREATE RETURNS', res)
		examId = res.id;
		expect(res).toMatchObject(expected);
	});
});

test('POST /api/exams - error if creator type is wrong', () => {

	let exam = {
		id_creator: -1,
		tasks: [1, 2, 3]
	};

	expect.assertions(1);

	return expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('POST /api/exams - error if there is no task list', () => {
	expect.assertions(1);

	let exam = {
		id_creator: expect.any(Number)
	};

	return expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('POST /api/exams - error if task list is not an array of positive numbers', () => {
	expect.assertions(1);

	let exam = {
		id_creator: expect.any(Number),
		tasks: ['aaa', 1, 2]
	};

	return expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('GET /api/exams/:id - error if parameter type is wrong', () => {
	expect.assertions(1);

	return expect(db.exam.getOne('wrong parameter type')).rejects.toBeInstanceOf(Error);
});

test('GET /api/exams/:id - get exam item by id', () => {
	expect.assertions(1);
	return expect(db.exam.getOne(examId)).resolves.toMatchObject(singleExam);
});

test('PUT /api/exams/:id - edit a specific exam', () => {
	expect.assertions(1);

	let exam = {
		id_creator: 2,
		tasks: [4, 5, 6]
	}
	return expect(db.exam.edit(examId, exam)).resolves.toMatchObject(singleExam);
});

test('DELETE /api/exams/:id - deletes a specific exam', () => {
	expect.assertions(1);

	return expect(db.exam.delete(examId)).resolves.toBeUndefined();
});

test('DELETE /api/exams/:id - error if parameter is a string', () => {
	expect.assertions(1);

	return expect(db.exam.delete('string')).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - error if parameter is 0', () => {
	expect.assertions(1);

	return expect(db.exam.delete(0)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - error if parameter is null', () => {
	expect.assertions(1);

	return expect(db.exam.delete(null)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - error if parameter is negative', () => {
	expect.assertions(1);

	return expect(db.exam.delete(-1)).rejects.toBeInstanceOf(Error);
});

test('PUT /api/exams/:id - edit with negative id', () => {
	expect.assertions(1);

	let exam = {
		id_creator: 2,
		tasks: [2, 3, 4, 5]
	}
	return expect(db.exam.edit(-15, exam)).rejects.toBeInstanceOf(Error);
});

test('PUT /api/exams/:id - edit with 0', () => {
	expect.assertions(1);

	let exam = {
		id_creator: 2,
		tasks: [2, 3, 4, 5]
	}

	return expect(db.exam.edit(0, exam)).rejects.toBeInstanceOf(Error);
});

test('PUT /api/exams/:id - edit with id_creator string', () => {
	expect.assertions(1);

	let exam = {
		id_creator: 'nome',
		tasks: [2, 3, 4, 5]
	}

	return expect(db.exam.edit(1, exam)).rejects.toBeInstanceOf(Error);

});

test('PUT /api/exams/:id - edit with task not of positive int', () => {
	expect.assertions(1);

	let exam = {
		id_creator: 2,
		tasks: [2, -4, 4, 5]
	}

	return expect(db.exam.edit(1, exam)).rejects.toBeInstanceOf(Error);
});

afterAll(() => {
	console.warn("Closing DB");
	db.close();
});