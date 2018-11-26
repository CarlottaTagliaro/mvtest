const db = require('../controllers/db');

const expectedTask = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(String)
};
var taskId = null;

test('Function Definition', () => {
	let functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

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

test('getOne should return a task', () => {
	return expect(db.task.getOne(taskId)).resolves.toMatchObject(expectedTask);
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

afterAll(() => {
	db.close();
})