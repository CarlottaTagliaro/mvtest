const db = require('../controllers/db');

const FUNCTIONS = ['getAll', 'getOne', 'create', 'update', 'delete'];

const EXPECTED_REVIEW = {
  id: expect.any(Number),
  mark: expect.any(Number),
  comment: expect.any(String),
  id_assign: expect.any(Number),
  id_user: expect.any(Number),
  id_task: expect.any(Number)
};

const ASSIGN_ID = 1;

var reviewId = null;

test('Function Definition', () => {
  expect.assertions(FUNCTIONS.length);

  for (method of FUNCTIONS) {
    expect(db.review[method]).toBeDefined();
  }
});

test('create with wrong structure should reject an error', () => {
  let review = {
    mark: "Testing User",
    comment: 12,
    id_assign: ASSIGN_ID,
    id_user: 1,
    id_task: 1
  };

  expect.assertions(1);
  return expect(db.review.create(review)).rejects.toThrow();
});

test('create should return the new review\'s id', () => {
  let review = {
      mark: 9,
      comment: "Well done",
      id_assign: ASSIGN_ID,
      id_user: 1,
      id_task: 1
    },
    expected = {
      id: expect.any(Number)
    };

  expect.assertions(1);
  return db.review.create(review).then((res) => {
    reviewId = res.id;
    expect(res).toMatchObject(expected);
  });
});

test('getAll should return an array of reviews', () => {
  expect.assertions(1);
  return expect(db.review.getAll(ASSIGN_ID)).resolves.toEqual(expect.arrayContaining([EXPECTED_REVIEW]));
});

test('getOne with wrong id should reject error', () => {
  expect.assertions(1);
  return expect(db.review.getOne(-1)).rejects.toThrow();
});

test('getOne with wrong id type should reject error', () => {
  expect.assertions(1);
  return expect(db.review.getOne('not a number')).rejects.toThrow();
});

test('getOne should return a review', () => {
  expect.assertions(1);
  return expect(db.review.getOne(reviewId)).resolves.toMatchObject(EXPECTED_REVIEW);
});

test('update with wrong id should reject an error', () => {
  let review = {
    email: "review@testing.com",
    name: "Testing User"
  }

  expect.assertions(1);
  return expect(db.review.update(-15, review)).rejects.toThrow();
});

test('update with wrong data should reject an error', () => {
  let review = {
    email: "review@testing.com"
  }

  expect.assertions(1);
  return expect(db.review.update(reviewId, review)).rejects.toThrow();
});

test('update should update and return a review', () => {
  let review = {
    mark: 2,
    comment: "Terrible"
  }

  expect.assertions(1);
  return expect(db.review.update(reviewId, review)).resolves.toMatchObject(review);
});

test('delete with wrong id type should reject an error', () => {
  expect.assertions(1);
  return expect(db.review.delete('not a number')).rejects.toThrow();
});

test('delete should delete a review', () => {
  expect.assertions(1);
  return expect(db.review.delete(reviewId)).resolves.toBeUndefined();
});

test('delete with wrong id should reject an error', () => {
  expect.assertions(1);
  return expect(db.review.delete(reviewId)).rejects.toThrow();
});

afterAll(() => {
  db.close();
});