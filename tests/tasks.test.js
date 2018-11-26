var db = require('../controllers/db');
var taskId = ''

test('Function Definition', () => {
	let functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

	for (method of functions) {
		expect(db.task[method]).toBeDefined();
	}
});

test('create should return the new task\'s id', () => {
	let task = {
			id_type: 1,
			text: "{'question:'sample question'}",
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

test('getAll should return Array', () => {
	let expected = [{
		id: expect.any(Number),
		text: expect.any(String),
		points: expect.any(Number),
		type: expect.any(String)
	}];

	return expect(db.task.getAll()).resolves.toEqual(expect.arrayContaining(expected));
});

test('getOne should return Object', () => {
	// TODO: parametrize id
	return expect(db.task.getOne(taskId)).resolves.toBeInstanceOf(Object);
});

test('delete should delete a task', () => {
	return expect(db.task.delete(taskId)).resolves.toBeUndefined();
})