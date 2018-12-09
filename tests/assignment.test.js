const db = require('./connection.js');

const functions = ['getAll', 'getOne', 'create', 'edit', 'delete'];

const Assignments = [{
  id: expect.any(Number),
  deadline: expect.any(Date),
  review: expect.any(Boolean),
  id_user: expect.any(Number),
  id_exam: expect.any(Number),
  id_class: expect.any(Number)
}];

const singleAssignment = {
  id: expect.any(Number),
  deadline: expect.any(Date),
  review: expect.any(Boolean),
  id_user: expect.any(Number),
  id_exam: expect.any(Number),
  id_class: expect.any(Number)
}

var assignId = null;

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
    deadline: '2018-12-3',
    review: true,
    id_user: 2,
    id_exam: 2,
    id_class: 2
  }

  ID = {
    id: expect.any(Number)
  }

  return db.assignment.create(assignment).then(res => {
    assignId = res.id;
    expect(res).toMatchObject(ID);
  });
});

test('POST /assignments - error if parameter has wrong structure', () => {
  expect.assertions(1);
  let assignment = {
    deadline: '2018-12-3',
    id_user: 2,
    id_exam: 2,
    id_class: 2
  };

  return expect(db.assignment.create(assignment)).rejects.toThrow();
});

test('POST /assignments - error if id_user type is wrong', () => {
  expect.assertions(1);
  let assignment = {
    deadline: '2018-12-3',
    review: true,
    id_user: 'not a number',
    id_exam: 2,
    id_class: 2
  };

  return expect(db.assignment.create(assignment)).rejects.toThrow();
});

test('POST /assignments - error if one parameter is missing', () => {
  expect.assertions(1);
  let assignment = {
    deadline: '2018-12-3',
    id_user: 1,
    id_exam: 2,
    id_class: 2
  };

  return expect(db.assignment.create(assignment)).rejects.toThrow();
});

test('EDIT /asssignments/:id - Edits assignment and returns the updated one', () => {
  expect.assertions(1);

  let assignment = {
    deadline: '2018-12-13',
    review: false,
    id_user: 2,
    id_exam: 2,
    id_class: 2
  };

  return expect(db.assignment.edit(assignId, assignment)).resolves.toMatchObject(singleAssignment);
});

test('EDIT /asssignments/:id - Error if a foreign key costraint is not respected', () => {
  expect.assertions(1);

  let assignment = {
    deadline: '2018-12-13',
    review: false,
    id_user: 2,
    id_exam: 500,
    id_class: 2
  };

  return expect(db.assignment.edit(assignId, assignment)).rejects.toThrow();
});

test('DELETE /assignments/:id - Deletes an assignment', () => {
  expect.assertions(1);

  return expect(db.assignment.delete(assignId)).resolves.toBeUndefined();
});

test('DELETE /assignments/:id - Delete with wrong id should throw', () => {
  expect.assertions(1);

  return expect(db.assignment.delete(-1)).rejects.toThrow();
});

afterAll(() => {
  console.warn("Closing DB");
  db.close();
});

test('support functions tested', () => {
  return expect(db.assignment._positiveId(1)).toBeTruthy();
});

test('support functions tested', () => {
  return expect(db.assignment._positiveId(-1)).toBeFalsy();
});