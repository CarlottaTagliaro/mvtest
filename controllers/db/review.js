const GET_ALL_REVIEWS_FOR_ASSIGN = 'SELECT Review.* FROM Review WHERE Review.Id_Assign=$1';
const GET_ONE_REVIEW_FOR_ASSIGN = 'SELECT Review.*,Task.* FROM Review, Task WHERE Review.Id_Task=Task.Id AND Review.Id=$1';
const CREATE_REVIEW = 'INSERT INTO Review(Mark, Comment, Id_Assign, Id_User, Id_Task) VALUES($1, $2, $3, $4, $5) RETURNING Id;';
const UPDATE_REVIEW = 'UPDATE Review SET Mark = $1, Comment = $2 WHERE Id = $3 RETURNING *;';
const DELETE_REVIEW = 'DELETE FROM Review WHERE Id = $1;';

module.exports = class Review {
  constructor(db) {
    this.db = db;
  }

  getAll(assignId) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(assignId, 1)) {

        this.db.query(GET_ALL_REVIEWS_FOR_ASSIGN, [assignId])
          .then(res => resolve(res.rows))
          .catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  getOne(id) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 1)) {

        this.db.query(GET_ONE_REVIEW_FOR_ASSIGN, [id])
          .then(res => {
            if (res.rows.length == 0) {
              let error = new Error("Review not found");
              error.errno = 404;
              reject(error);
            } else {
              resolve(res.rows[0]);
            }
          })
          .catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  create(review) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(review, {}) &&
        this._typeCheck(review.mark, 0) &&
        this._typeCheck(review.comment, '') &&
        this._typeCheck(review.id_assign, 0) &&
        this._typeCheck(review.id_user, 0) &&
        this._typeCheck(review.id_task, 0)) {

        this.db.query(CREATE_REVIEW, [review.mark, review.comment, review.id_assign, review.id_user, review.id_task])
          .then(res => resolve(res.rows[0]))
          .catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  update(id, review) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 0) &&
        this._typeCheck(review, {}) &&
        this._typeCheck(review.mark, 0) &&
        this._typeCheck(review.comment, '')) {

        this.db.query(UPDATE_REVIEW, [review.mark, review.comment, id])
          .then(res => {
            console.warn(res.rows);
            if (res.rows.length == 0) {
              let error = new Error("Review not found");
              error.errno = 404;
              reject(error);
            } else {
              resolve(res.rows[0]);
            }
          })
          .catch(err => reject(err));
      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 0)) {

        this.getOne(id).then(() => {

          this.db.query(DELETE_REVIEW, [id])
            .then(res => resolve())
            .catch(err => reject(err));

        }).catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  //returns true when a has the same value of a_std_value
  //throws Error on assertion failed and returns false
  _typeCheck(a, a_std_value) {
    if ((this._getType(a)) == this._getType((a_std_value))) {
      return true;
    }
    return false;
  }

  _getType(value) {
    return Object.prototype.toString.call(value)
      .replace(/^\[object |\]$/g, '').toLowerCase();
  };
}