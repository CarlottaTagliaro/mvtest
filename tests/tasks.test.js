const db = require('../controllers/db');

const FUNCTIONS = ['getAll', 'getOne', 'create', 'update', 'delete', 'getRights', 'addRights', 'deleteRights'];

const EXPECTED_RIGHTS = [{
	id_user: expect.any(Number),
	owner: expect.any(Boolean),
	modifier: expect.any(Boolean)
}];

const EXPECTED_TASK = [{
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(Number)
}];

const EXPECTED_TASK_RIGHTS = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(Number),
	users: expect.arrayContaining(EXPECTED_RIGHTS)
};

var taskId = null;

test('Function Definition', () => {
	expect.assertions(FUNCTIONS.length);

	for (method of FUNCTIONS) {
		expect(db.task[method]).toBeDefined();
	}
});

test('create should return the new task\'s id', () => {
	let task = {
			id_type: 1,
			text: "Sample question",
			choices: ["one", "two", "three"],
			points: 10,
			users: [{
				id_user: 1,
				owner: true,
				modifier: true
			}, {
				id_user: 3,
				owner: false,
				modifier: false
			}]
		},
		expected = {
			id: expect.any(Number)
		};

	expect.assertions(1);
	return db.task.create(task).then((res) => {
		taskId = parseInt(res.id);
		expect(res).toMatchObject(expected);
	});
});

test('getAll should return an array of tasks', () => {
	expect.assertions(1);
	return expect(db.task.getAll()).resolves.toEqual(expect.arrayContaining(EXPECTED_TASK));
});

test('getOne with wrong id should reject error', () => {
	expect.assertions(1);
	return expect(db.task.getOne(-1)).rejects.toThrow();
});

test('getOne should return a task', () => {
	expect.assertions(1);
	return expect(db.task.getOne(taskId)).resolves.toMatchObject(EXPECTED_TASK_RIGHTS);
});


test('update with wrong id should reject an error', () => {
	let task = {
		id_type: 1,
		text: "Sample question",
		choices: ["one", "two", "three"],
		points: 15,
		users: [{
			id_user: 1,
			owner: true,
			modifier: true
		}, {
			id_user: 3,
			owner: false,
			modifier: true
		}]
	};

	expect.assertions(1);
	return expect(db.task.update(-1, task)).rejects.toBeInstanceOf(Error);
});

test('update should update and return a task', () => {
	let task = {
			id_type: 1,
			text: "Sample question",
			choices: ["one", "two", "three"],
			points: 15,
			users: [{
				id_user: 1,
				owner: true,
				modifier: true
			}, {
				id_user: 3,
				owner: false,
				modifier: true
			}]
		},
		Expectedtask = {
			id_type: 1,
			text: "{\"question\":\"Sample question\",\"choices\":[\"one\",\"two\",\"three\"]}",
			points: 15,
			users: [{
				id_user: 1,
				owner: true,
				modifier: true
			}, {
				id_user: 3,
				owner: false,
				modifier: true
			}]
		}


	expect.assertions(1);
	return expect(db.task.update(taskId, task)).resolves.toMatchObject(Expectedtask);
});

test('getRights with wrong id should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.getRights(-1)).rejects.toBeInstanceOf(Error);
});

test('getRights with wrong id type should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.getRights('not a number')).rejects.toBeInstanceOf(Error);
});

test('getRights should return all rights for a task', () => {
	expect.assertions(1);
	return expect(db.task.getRights(taskId)).resolves.toEqual(expect.arrayContaining(EXPECTED_RIGHTS));
});

test('deleteRights with wrong id should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights(-1)).rejects.toBeInstanceOf(Error);
});

test('deleteRights with wrong id type should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights('not a number')).rejects.toBeInstanceOf(Error);
});

test('deleteRights should delete all rights', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights(taskId)).resolves.toBeUndefined();
});

test('addRights with wrong id_task should reject an error', () => {
	let rights = [{
		id_user: 4,
		owner: true,
		modifier: true
	}, {
		id_user: 2,
		owner: false,
		modifier: false
	}];

	expect.assertions(1);
	return expect(db.task.addRights(-1, rights)).rejects.toBeInstanceOf(Error);
});

test('addRights with wrong structure should reject an error', () => {
	let rights = {
		id_user: 4,
		owner: true,
		modifier: true
	};

	expect.assertions(1);
	return expect(db.task.addRights(taskId, rights)).rejects.toBeInstanceOf(Error);
});

test('addRights should add new rights', () => {
	let rights = [{
		id_user: 4,
		owner: true,
		modifier: true
	}, {
		id_user: 2,
		owner: false,
		modifier: false
	}];

	let expectedRights = rights;
	expectedRights[0].id_task = taskId;
	expectedRights[1].id_task = taskId;

	expect.assertions(1);
	return expect(db.task.addRights(taskId, rights)).resolves.toEqual(expectedRights);
});

test('getRights with wrong id should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.getRights(-1)).rejects.toBeInstanceOf(Error);
});

test('getRights with wrong id type should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.getRights('not a number')).rejects.toBeInstanceOf(Error);
});

test('getRights should return all rights for a task', () => {
	expect.assertions(1);
	return expect(db.task.getRights(taskId)).resolves.toEqual(expect.arrayContaining(EXPECTED_RIGHTS));
});

test('deleteRights with wrong id should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights(-1)).rejects.toBeInstanceOf(Error);
});

test('deleteRights with wrong id type should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights('not a number')).rejects.toBeInstanceOf(Error);
});

test('deleteRights should delete all rights', () => {
	expect.assertions(1);
	return expect(db.task.deleteRights(taskId)).resolves.toBeUndefined();
});

test('addRights with wrong id_task should reject an error', () => {
	let rights = [{
		id_user: 4,
		owner: true,
		modifier: true
	}, {
		id_user: 2,
		owner: false,
		modifier: false
	}];

	expect.assertions(1);
	return expect(db.task.addRights(-1, rights)).rejects.toBeInstanceOf(Error);
});

test('addRights with wrong structure should reject an error', () => {
	let rights = {
		id_user: 4,
		owner: true,
		modifier: true
	};

	expect.assertions(1);
	return expect(db.task.addRights(taskId, rights)).rejects.toBeInstanceOf(Error);
});

test('addRights should add new rights', () => {
	let rights = [{
		id_user: 4,
		owner: true,
		modifier: true
	}, {
		id_user: 2,
		owner: false,
		modifier: false
	}];

	let expectedRights = rights;
	expectedRights[0].id_task = taskId;
	expectedRights[1].id_task = taskId;

	expect.assertions(1);
	return expect(db.task.addRights(taskId, rights)).resolves.toEqual(expectedRights);
});

test('delete should delete a task', () => {
	expect.assertions(1);
	return expect(db.task.delete(taskId)).resolves.toBeUndefined();
});

test('delete with wrong id should reject an error', () => {
	expect.assertions(1);
	return expect(db.task.delete(taskId)).rejects.toBeInstanceOf(Error);
});

afterAll(() => {
	db.close();
});