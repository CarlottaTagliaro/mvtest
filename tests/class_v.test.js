let class_v = require('../controllers/db/class_view.js');
const db = require('../controllers/db');

const classes_v = [{
	id: expect.any(Number),
	name: expect.any(String)
}];

const class_template = {
	id : expect.any(Number),
	name : expect.any(String)
}

let gc_class = -1;

test('as_defined_in_spec', ()=>{
  let spec = ['getAll', 'getById', 'create', 'edit', 'delete'];
  let cv = new class_v({'query': function(){}});
  for(method of spec){
    expect(cv[method]).toBeDefined();
  }
});

test('constructor_type_inference', ()=>{
  let not_working_values = [true, 0, "", undefined, null];
  for(val of not_working_values){
    expect(()=>{ new class_v(val); }).toThrow();
  }  
});

test('GET /api/class - get all classes', () => {
	return expect(db.class_v.getAll()).resolves.toEqual(expect.arrayContaining(classes_v));
});

test('POST /api/class - creates a class and returns its id', () => {
	let class_tmp = {
			id: 200,
			name: "name"
		},
		expected = {
			id: expect.any(Number)
		};

	//expect.assertions(1);
	return db.class_v.create(class_tmp).then((res) => {
		console.log('CREATE RETURNS', res)
		gc_class = res.id;
		expect(res).toMatchObject(expected);
	});
});

test('GET /api/class/:id - get class by id', () => {
	return expect(db.class_v.getById(gc_class)).resolves.toMatchObject(class_template);
});

test('DELETE /api/class/:id - deletes class', () => {
	console.warn(">>>>>>>>>>" + gc_class);
	return expect(db.class_v.delete(gc_class)).resolves.toBeUndefined();
});

afterAll(() => {
	console.warn("Closing DB");
	db.close();
});
