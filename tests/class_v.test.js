const db = require('./connection.js');

const classes_v = [{
	id: expect.any(Number),
	name: expect.any(String)
}];

const class_template = {
	id: expect.any(Number),
	name: expect.any(String),
	users: expect.any(Array)
}

let gc_class = -1;

test('as_defined_in_spec', () => {
	let spec = ['getAll', 'getById', 'create', 'edit', 'delete'];
	for (method of spec) {
		expect(db.class[method]).toBeDefined();
	}
});

it('value checking', async () => {
	let values = [
		['getById', [ null, undefined, NaN, {}]],
		['create', [null, undefined, NaN, {}]],
		['edit', [
			[10001, null],
			[{}, undefined]
		]],
		['delete', [ null, undefined, NaN, {}]]
	]
	for (val of values) {
		let fun = val[0];
		let args = val[1];
		await expect(() => db.class[fun](...args)).toThrow();
	}
});

test('constructor_type_inference', () => {
	let not_working_values = [true, 0, "", undefined, null];
	for (val of not_working_values) {
		expect(() => {
			new db.class(val);
		}).toThrow();
	}
});

test('GET /api/classes - get all classes', () => {
	return expect(db.class.getAll()).resolves.toEqual(expect.arrayContaining(classes_v));
});

test('POST /api/classes - creates a class and returns its id', () => {
	let class_tmp = {
			name: "name",
			users: [{id:1},{id: 2},{id: 3}]
		},
		expected = {
			id: expect.any(Number)
		};

	expect.assertions(1);
	return db.class.create(class_tmp).then((res) => {
		gc_class = res.id;
		expect(res).toMatchObject(expected);
	});
});

test('GET /api/classes/:id - get class by id', () => {
	return expect(db.class.getById(gc_class)).resolves.toMatchObject(class_template);
});


test('PUT /api/classes/:id - edit a specific exam', () => {
	expect.assertions(1);

	let class_tmp = {
		name: "OKOKOK",
		users: [1, 2]
	}
	return expect(db.class.edit(gc_class, class_tmp)).resolves.toMatchObject(class_template);
});


test('DELETE /api/classes/:id - deletes class', () => {
	expect.assertions(1);
	return expect(db.class.delete(gc_class)).resolves.toBeUndefined();
});

afterAll(() => {
	console.warn("Closing DB");
	db.close();
});
