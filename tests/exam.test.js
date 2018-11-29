const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const Exam = {
	id: expect.any(Number),
	 id_creator: expect.any(Number)
 };

 const singleExam = {
	id: expect.any(Number),
    id_creator: expect.any(Number),
    tasks: [4,5,6]
 }

var examId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.exam[method]).toBeDefined();
	}
});

test('GET /api/exams - get all exams', () => {
	return expect(db.exam.getAll()).resolves.toEqual(expect.arrayContaining([Exam]));
});

test('GET /api/exams/:id - get exam item by id', () => {
	return expect(db.exam.getOne(2)).resolves.toMatchObject(singleExam);
});

test('GET /api/exams/:id - error if parameter is a string', () => {
    return expect(() => {return db.exam.getOne('string')}).toThrowError();
});

test('GET /api/exams/:id - error if parameter is 0', () => {
    return expect(() => {return db.exam.getOne(0)}).toThrowError();
});

test('GET /api/exams/:id - error if parameter is null', () => {
    return expect(() => { return db.exam.getOne(null)}).toThrowError();
});

test('GET /api/exams/:id - error if parameter is negative', () => {
    return expect(() => { return db.exam.getOne(-1)}).toThrowError();
});

test('POST /api/exams - creates an exam and return its id', () => {
	let exam = {
        id_creator: 2,
        tasks : [1,2,3]
		},
		expected = {
			id: expect.any(Number)
		};

	expect(db.exam.create(exam).then((res) => {
		examId = parseInt(res);
		console.log(examId);
		expect(res).toMatchObject(expected);
	}));
});

test('POST /api/exams - error if there is no creator', () => {
	let exam = {
        tasks : [expect.any(Number)]
		};

		return expect(() => { return db.exam.create(exam)}).toThrowError();
});

test('POST /api/exams - error if creator is a string', () => {
	let exam = {
        id_creator: 'creator',
        tasks : [expect.any(Number)]
		};

		return expect(() => { return db.exam.create(exam)}).toThrowError();
});

test('POST /api/exams - error if there is no task list', () => {
	let exam = {
        id_creator: expect.any(Number)
	};

	return expect(() => { return db.exam.create(exam)}).toThrowError();
});

test('POST /api/exams - error if task list is not an array of positive numbers', () => {
	let exam = {
		id_creator: expect.any(Number),
		tasks : ['aaa',1,2]
	};

	return expect(() => { return db.exam.create(exam)}).toThrowError();
});

/*test('DELETE /api/exams/:id - deletes a specific exam', () => {
	return expect(db.exam.delete(examId)).resolves.toBeUndefined();
});*/

test('DELETE /api/exams/:id - error if parameter is a string', () => {
    return expect(() => {return db.exam.getOne('string')}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is 0', () => {
    return expect(() => {return db.exam.getOne(0)}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is null', () => {
    return expect(() => {return db.exam.getOne(null)}).toThrowError();
});

test('DELETE /api/exams/:id - error if parameter is negative', () => {
    return expect(() => {return db.exam.getOne(-1)}).toThrowError();
});

test('PUT /api/exams/:id - edit with negative id', () => {
    let exam = {
        id_creator: 2,
        tasks : [2,3,4,5]
	}
	return expect(() => { return db.exam.edit(-15, exam)}).toThrowError();
});

test('PUT /api/exams/:id - edit with 0', () => {
    let exam = {
        id_creator: 2,
        tasks : [2,3,4,5]
	}
	return expect(() => { return db.exam.edit(0, exam)}).toThrowError();
});

test('PUT /api/exams/:id - edit with id_creator string', () => {
    let exam = {
        id_creator: 'nome',
        tasks : [2,3,4,5]
	}
	return expect(() => { return db.exam.edit(1, exam)}).toThrowError();
});

test('PUT /api/exams/:id - edit with task not of positive int', () => {
    let exam = {
        id_creator: 2,
        tasks : [2,-4,4,5]
	}
	return expect(() => { return db.exam.edit(1, exam)}).toThrowError();
});