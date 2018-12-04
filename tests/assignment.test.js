const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const Assignments = [{
    id : expect.any(Number),
    deadline : expect.any(Date),
    review : expect.any(Boolean),
    id_user: expect.any(Number),
    id_exam: expect.any(Number),
    id_class: expect.any(Number)
}];

const singleAssignment = {
    id : expect.any(Number),
    deadline : expect.any(Date),
    review : expect.any(Boolean),
    id_user: expect.any(Number),
    id_exam: expect.any(Number),
    id_class: expect.any(Number)
}

var examId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.assignment[method]).toBeDefined();
	}
});

test('GET /api/assignments - get all assignments', () => {
	expect.assertions(1);
	return expect(db.assignment.getAll()).resolves.toEqual(expect.arrayContaining(Assignments));
});

test('GET /api/assignments/:id - error if parameter type is wrong', () => {
	expect.assertions(1);
	return expect(db.assignment.getOne('wrong parameter type')).rejects.toBeInstanceOf(Error);
});

test('GET /api/assignments/:id - get assignment item by id', () => {
	expect.assertions(1);
	return expect(db.assignment.getOne(1)).resolves.toMatchObject(singleAssignment);
});

test('POST /assignments - creates an assignment and returns its id', () => {
    expect.assertions(1);
    let assignment = {
        date : '2018-12-3',
        review: true,
        id_user: 2,
        id_exam: 2,
        id_class: 2
    }
    
    ID = {
        id: expect.any(Number)
    }

    return expect(db.assignment.create(assignment)).resolves.toMatchObject(ID);
});


afterAll(() => {
	console.warn("Closing DB");
	db.close();
});