class_v = require('../controllers/db/class_view.js');

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
