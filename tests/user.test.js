const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'update', 'delete'];
const expectedUser = {
  id: expect.any(Number),
  email: expect.any(String),
  name: expect.any(String)
};
var userId = null;

test('Function Definition', () => {
  for (method of functions) {
    expect(db.user[method]).toBeDefined();
  }
});

test('create with wrong structure should reject an error', () => {
  let user = {
    name: "Testing User"
  };

  return expect(db.user.create(user)).rejects.toThrow();
});

test('create should return the new user\'s id', () => {
  let user = {
      email: "user@testing.com",
      name: "Testing User"
    },
    expected = {
      id: expect.any(Number)
    };

  expect(db.user.create(user).then((res) => {
    userId = res.id;
    expect(res).toMatchObject(expected);
  }));
});

test('getAll should return an array of users', () => {
  return expect(db.user.getAll()).resolves.toEqual(expect.arrayContaining([expectedUser]));
});

test('getOne with wrong id should reject error', () => {
  return expect(db.user.getOne(-1)).rejects.toThrow();
});

test('getOne with wrong id type should reject error', () => {
  return expect(db.user.getOne('not a number')).rejects.toThrow();
});

test('getOne should return a user', () => {
  return expect(db.user.getOne(userId)).resolves.toMatchObject(expectedUser);
});

test('update with wrong id should reject an error', () => {
  let user = {
    email: "user@testing.com",
    name: "Testing User"
  }

  return expect(db.user.update(-15, user)).rejects.toThrow();
});

test('update with wrong data should reject an error', () => {
  let user = {
    email: "user@testing.com"
  }

  return expect(db.user.update(userId, user)).rejects.toThrow();
});

test('update should update and return a user', () => {
  let user = {
    email: "user@testing.com",
    name: "Testing User [modified]"
  }

  return expect(db.user.update(userId, user)).resolves.toMatchObject(user);
});

test('delete with wrong id type should reject an error', () => {
  return expect(db.user.delete('not a number')).rejects.toThrow();
});

test('delete should delete a user', () => {
  return expect(db.user.delete(userId)).resolves.toBeUndefined();
});

test('delete with wrong id should reject an error', () => {
  return expect(db.user.delete(userId)).rejects.toThrow();
});

afterAll(() => {
  db.close();
});