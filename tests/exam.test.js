const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const Exam = {
	id: expect.any(Number),
 	id_creator: expect.any(Number)
 };

 const singleExam = {
	id: expect.any(Number),
    id_creator: expect.any(Number),
    tasks : [expect.any(Number)]
 }

var examId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.exam[method]).toBeDefined();
	}
});

test('GET /api/exams - get all exams', () => {
	expect(db.exam.getAll()).resolves.toEqual(expect.arrayContaining([Exam]));
});

test('GET /api/exams/:id - get exam item by id', () => {
    expect(db.exam.getOne(1)).resolves.toMatchObject(singleExam);
});

test('GET /api/exams/:id - error if parameter is a string', () => {
    expect(db.exam.getOne('string')).rejects.toBeInstanceOf(Error);
});

test('GET /api/exams/:id - error if parameter is 0', () => {
    expect(db.exam.getOne(0)).rejects.toBeInstanceOf(Error);
});

test('GET /api/exams/:id - error if parameter is null', () => {
    expect(db.exam.getOne(null)).rejects.toBeInstanceOf(Error);
});

test('GET /api/exams/:id - error if parameter is negative', () => {
    expect(db.exam.getOne(-1)).rejects.toBeInstanceOf(Error);
});

test('POST /api/exams - creates an exam and return its id', () => {
	let exam = {
        id_creator: expect.any(Number),
        tasks : [expect.any(Number)]
		},
		expected = {
			id: expect.any(Number)
		};

	expect(db.exam.create(exam).then((res) => {
		examId = res.id;
		expect(res).toMatchObject(expected);
	}));
});

test('POST /api/exams - error if there is no creator', () => {
	let exam = {
        tasks : [expect.any(Number)]
		};

	expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('POST /api/exams - error if creator is a string', () => {
	let exam = {
        id_creator: 'creator',
        tasks : [expect.any(Number)]
		};

	expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('POST /api/exams - error if there is no task list', () => {
	let exam = {
        id_creator: expect.any(Number)
	};

	expect(db.exam.create(exam)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - deletes a specific task', () => {
	expect(db.exam.delete(1)).resolves.toBeUndefined();
});

test('DELETE /api/exams/:id - error if parameter is a string', () => {
    expect(db.exam.delete('string')).rejects.toBeInstanceOf(Error);
});

test('GDELETE /api/exams/:id - error if parameter is 0', () => {
    expect(db.exam.delete(0)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - error if parameter is null', () => {
    expect(db.exam.delete(null)).rejects.toBeInstanceOf(Error);
});

test('DELETE /api/exams/:id - error if parameter is negative', () => {
    expect(db.exam.delete(-1)).rejects.toBeInstanceOf(Error);
});

/*test('PUT /api/exams/:id - edit with negative id', () => {
    let exam = {
        id_creator: 2,
        tasks : [2,3,4,5]
	}
	expect(db.exam.edit(-15, exam)).rejects.toBeInstanceOf(Error);
});*/