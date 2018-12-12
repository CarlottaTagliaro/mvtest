const db = require('./connection.js')

const FUNCTIONS = ['getAll', 'getOne', 'create', 'update', 'delete']

const EXPECTED_USER = {
  id: expect.any(Number),
  email: expect.any(String),
  name: expect.any(String)
}

var userId = null

test('Function Definition', () => {
  expect.assertions(FUNCTIONS.length)

  for (let method of FUNCTIONS) {
    expect(db.user[method]).toBeDefined()
  }
})

test('create with wrong structure should reject an error', () => {
  let user = {
    name: 'Testing User'
  }

  expect.assertions(1)
  return expect(db.user.create(user)).rejects.toThrow()
})

test('create should return the new user\'s id', () => {
  let user = {
    email: 'user@testing.com',
    name: 'Testing User'
  }

  let expected = {
    id: expect.any(Number)
  }

  expect.assertions(1)
  return db.user.create(user).then((res) => {
    userId = res.id
    expect(res).toMatchObject(expected)
  })
})

test('getAll should return an array of users', () => {
  expect.assertions(1)
  return expect(db.user.getAll()).resolves.toEqual(expect.arrayContaining([EXPECTED_USER]))
})

test('getOne with wrong id should reject error', () => {
  expect.assertions(1)
  return expect(db.user.getOne(-1)).rejects.toThrow()
})

test('getOne with wrong id type should reject error', () => {
  expect.assertions(1)
  return expect(db.user.getOne('not a number')).rejects.toThrow()
})

test('getOne should return a user', () => {
  expect.assertions(1)
  return expect(db.user.getOne(userId)).resolves.toMatchObject(EXPECTED_USER)
})

test('update with wrong id should reject an error', () => {
  let user = {
    email: 'user@testing.com',
    name: 'Testing User'
  }

  expect.assertions(1)
  return expect(db.user.update(-15, user)).rejects.toThrow()
})

test('update with wrong data should reject an error', () => {
  let user = {
    email: 'user@testing.com'
  }

  expect.assertions(1)
  return expect(db.user.update(userId, user)).rejects.toThrow()
})

test('update should update and return a user', () => {
  let user = {
    email: 'user@testing.com',
    name: 'Testing User [modified]'
  }

  expect.assertions(1)
  return expect(db.user.update(userId, user)).resolves.toMatchObject(user)
})

test('delete with wrong id type should reject an error', () => {
  expect.assertions(1)
  return expect(db.user.delete('not a number')).rejects.toThrow()
})

test('delete should delete a user', () => {
  expect.assertions(1)
  return expect(db.user.delete(userId)).resolves.toBeUndefined()
})

test('delete with wrong id should reject an error', () => {
  expect.assertions(1)
  return expect(db.user.delete(userId)).rejects.toThrow()
})

afterAll(() => {
  db.close()
})
