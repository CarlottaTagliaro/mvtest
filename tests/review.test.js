const db = require('../controllers/db')

const FUNCTIONS = ['getAll', 'getOne', 'create', 'update', 'delete']

const EXPECTED_REVIEW = {
  id: expect.any(Number),
  mark: expect.any(Number),
  comment: expect.any(String),
  id_creator: expect.any(Number),
  id_submission: expect.any(Number)
}

const SUBMISSION_ID = 1
const SESSION_USER = 1

var reviewId = null

test('Function Definition', () => {
  expect.assertions(FUNCTIONS.length)

  for (let method of FUNCTIONS) {
    expect(db.review[method]).toBeDefined()
  }
})

test('create with wrong structure should reject an error', () => {
  let review = {
    mark: 'Testing User',
    comment: 12,
    id_creator: 1
  }

  expect.assertions(1)
  return expect(db.review.create(SUBMISSION_ID, review, SESSION_USER)).rejects.toThrow()
})

test('create should return the new review\'s id', () => {
  let review = {
    mark: 9,
    comment: 'Well done',
    id_submission: 1
  }

  let expected = {
    id: expect.any(Number)
  }

  expect.assertions(1)
  return db.review.create(SUBMISSION_ID, review, SESSION_USER).then((res) => {
    reviewId = res.id
    expect(res).toMatchObject(expected)
  })
})

test('getAll should return an array of reviews', () => {
  expect.assertions(1)
  return expect(db.review.getAll(SUBMISSION_ID, SESSION_USER)).resolves.toEqual(expect.arrayContaining([EXPECTED_REVIEW]))
})

test('getOne with wrong id should reject error', () => {
  expect.assertions(1)
  return expect(db.review.getOne(0, -1, SESSION_USER)).rejects.toThrow()
})

test('getOne with wrong id type should reject error', () => {
  expect.assertions(1)
  return expect(db.review.getOne(1, 'not a number', SESSION_USER)).rejects.toThrow()
})

test('getOne should return a review', () => {
  expect.assertions(1)
  return expect(db.review.getOne(SUBMISSION_ID, reviewId, SESSION_USER)).resolves.toMatchObject(EXPECTED_REVIEW)
})

/* test('update with wrong id should reject an error', () => {
  let review = {
    email: "review@testing.com",
    name: "Testing User"
  }

  expect.assertions(1);
  return expect(db.review.update(ASSIGN_ID, -15, review, SESSION_USER)).rejects.toThrow();
});

test('update with wrong data should reject an error', () => {
  let review = {
    email: "review@testing.com"
  }

  expect.assertions(1);
  return expect(db.review.update(ASSIGN_ID, reviewId, review, SESSION_USER)).rejects.toThrow();
}); */

test('update should update and return a review', () => {
  let review = {
    mark: 2,
    comment: 'Terrible'
  }

  expect.assertions(1)
  return expect(db.review.update(SUBMISSION_ID, reviewId, review, SESSION_USER)).resolves.toMatchObject(review)
})

test('delete with wrong id type should reject an error', () => {
  expect.assertions(1)
  return expect(db.review.delete(1, 'not a number', SESSION_USER)).rejects.toThrow()
})

test('delete should delete a review', () => {
  expect.assertions(1)
  return expect(db.review.delete(SUBMISSION_ID, reviewId, SESSION_USER)).resolves.toBeUndefined()
})

test('delete with wrong id should reject an error', () => {
  expect.assertions(1)
  return expect(db.review.delete(SUBMISSION_ID, reviewId, SESSION_USER)).rejects.toThrow()
})

afterAll(() => {
  db.close()
})
