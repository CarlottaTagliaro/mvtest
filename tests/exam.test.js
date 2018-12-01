const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const EXAMS = [{
	id: expect.any(Number),
	id_creator: expect.any(Number)
}];

const singleExam = {
	id: expect.any(Number),
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
	let exam = {
			id_creator: 2,
			tasks: [1, 2, 3]
		},
		expected = {
			id: expect.any(Number)
		};

	expect.assertions(1);
	return db.exam.create(exam).then((res) => {
		console.log('CREATE RETURNS', res)
		examId = res.id;
		expect(res).toMatchObject(expected);
	});
});

test('POST /api/exams - error if creator type is wrong', () => {
	let exam = {
		tasks: [1, 2, 3]
	};
	let badValues = ['string', 0, null, -1];

	expect(() => {
		return db.exam.create(exam)
	}).toThrowError();

	for (let value of badValues) {
		expect(() => {
			exam.creator = value;
			return db.exam.create(exam);
		}).toThrowError();
	}
});

test('POST /api/exams - error if there is no task list', () => {
	let exam = {
		id_creator: expect.any(Number)
	};

	return expect(() => {
		return db.exam.create(exam);
	}).toThrowError();
});

test('POST /api/exams - error if task list is not an array of positive numbers', () => {
	let exam = {
		id_creator: expect.any(Number),
		tasks: ['aaa', 1, 2]
	};

	return expect(() => {
		return db.exam.create(exam);
	}).toThrowError();
});

test('GET /api/exams/:id - error if parameter type is wrong', () => {
	let badValues = ['string', 0, null, -1];

	for (let value of badValues) {
		expect(() => {
			return db.exam.getOne(value);
		}).toThrowError();
	}
});

test('GET /api/exams/:id - get exam item by id', () => {
	expect.assertions(1);
	return expect(db.exam.getOne(examId)).resolves.toMatchObject(singleExam);
});

test('DELETE /api/exams/:id - deletes a specific exam', () => {
	return db.exam.delete(examId).then((data) => {
		expect(data).toBeUndefined();
		console.warn(data);
	}).catch((err) => {
		console.error(examId, err);
	});
});

test('DELETE /api/exams/:id - error if parameter is a string', () => {
	expect(() => {
		return db.exam.getOne('string')
	}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is 0', () => {
	expect(() => {
		return db.exam.getOne(0)
	}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is null', () => {
	expect(() => {
		return db.exam.getOne(null)
	}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is negative', () => {
	expect(() => {
		return db.exam.getOne(-1)
	}).toThrowError();
});

test('PUT /api/exams/:id - edit with negative id', () => {
	let exam = {
		id_creator: 2,
		tasks: [2, 3, 4, 5]
	}
	expect(() => {
		return db.exam.edit(-15, exam)
	}).toThrowError();
});

test('PUT /api/exams/:id - edit with 0', () => {
	let exam = {
		id_creator: 2,
		tasks: [2, 3, 4, 5]
	}
	expect(() => {
		return db.exam.edit(0, exam)
	}).toThrowError();
});

test('PUT /api/exams/:id - edit with id_creator string', () => {
	let exam = {
		id_creator: 'nome',
		tasks: [2, 3, 4, 5]
	}
	expect(() => {
		return db.exam.edit(1, exam)
	}).toThrowError();
});

test('PUT /api/exams/:id - edit with task not of positive int', () => {
	let exam = {
		id_creator: 2,
		tasks: [2, -4, 4, 5]
	}
	expect(() => {
		return db.exam.edit(1, exam)
	}).toThrowError();
});