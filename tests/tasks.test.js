const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];
const expectedTask = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(String)
};
var taskId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.task[method]).toBeDefined();
	}
});

test('create should return the new task\'s id', () => {
	let task = {
			id_type: 1,
			text: "{ \"question\": \"sample question\" }",
			points: 10
		},
		expected = {
			id: expect.any(Number)
		};

	expect(db.task.create(task).then((res) => {
		taskId = res.id;
		expect(res).toMatchObject(expected);
	}));
});

test('getAll should return an array of tasks', () => {
	return expect(db.task.getAll()).resolves.toEqual(expect.arrayContaining([expectedTask]));
});

test('getOne with wrong id should reject error', () => {
	return expect(db.task.getOne(-1)).rejects.toThrow();
});

test('getOne should return a task', () => {
	return expect(db.task.getOne(taskId)).resolves.toMatchObject(expectedTask);
});


test('edit with wrong id should reject an error', () => {
	let task = {
		id_type: 1,
		text: "{ \"question\": \"not the same sample question\" }",
		points: 15
	}

	return expect(db.task.edit(-15, task)).rejects.toBeInstanceOf(Error);
});

test('edit should edit and return a task', () => {
	let task = {
		id_type: 1,
		text: "{ \"question\": \"not the same sample question\" }",
		points: 15
	}

	return expect(db.task.edit(taskId, task)).resolves.toMatchObject(task);
});

test('delete should delete a task', () => {
	return expect(db.task.delete(taskId)).resolves.toBeUndefined();
});

test('delete with wrong id should reject an error', () => {
	return expect(db.task.delete(taskId)).rejects.toBeInstanceOf(Error);
});

afterAll(() => {
	db.close();
});