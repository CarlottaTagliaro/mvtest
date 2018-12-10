const GET_ALL_REVIEWS_FOR_SUBMISSION = 'SELECT Review.* FROM Review, Submission WHERE Review.Id_Submission=$1 AND (Review.Id_Creator=$2 OR Submission.Id_User=$2) AND Review.Id_Submission=Submission.Id';
const GET_ONE_REVIEW_FOR_SUBMISSION = 'SELECT Review.* FROM Review, Submission WHERE Review.Id_Submission=$1 AND Review.Id=$2 AND (Review.Id_Creator=$3 OR Submission.Id_User=$3) AND Review.Id_Submission = Submission.Id;';

/// AAAAAAAAAAA
const CHECK_USER = 'SELECT * FROM Review, Submission, Assign, Class, ClassUser  WHERE Review.Id_Submission=Submission.Id AND Submission.Id_Assign=Assign.Id AND Assign.Id_Class=Class.Id AND Class.Id=ClassUser.Id_Class AND Submission.Id=$1 AND (Submission.Id_User!=$2 OR ClassUser.Id_User=$2 OR Assign.Id_Teacher=$2);';

const CHECK_USER_CREATE = 'SELECT * FROM Submission, Assign, Class, ClassUser WHERE Submission.Id_Assign=Assign.Id AND Assign.Id_Class=Class.Id AND Class.Id=ClassUser.Id_Class AND Submission.Id=$1 AND (Submission.Id_User!=$2 OR ClassUser.Id_User=$2 OR Assign.Id_Teacher=$2);';
const CREATE_REVIEW = 'INSERT INTO Review(Mark, Comment, Id_Creator, Id_Submission) VALUES($1, $2, $3, $4) RETURNING Id;';

const UPDATE_REVIEW = 'UPDATE Review SET Mark = $1, Comment = $2 WHERE Id = $3 RETURNING *;';
const DELETE_REVIEW = 'DELETE FROM Review WHERE Id = $1;';
const GET_LATEST_SUBMISSION_ID = 'SELECT Id FROM Submission WHERE Id_Assign=$1 AND Id_User=$2 ORDER BY Time DESC LIMIT 1;';

module.exports = class Review {
  constructor(db) {
    this.db = db;
  }

  /*getLatestSubmission(idAssign, idUser) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(idAssign, 0) &&
        this._typeCheck(idUser, 0)) {

        this.db.query(GET_LATEST_SUBMISSION_ID, [idAssign, idUser])
          .then(res => {
            if (res.rows[0])
              resolve(res.rows[0].id);
            else {
              let err = Error('Submission not found.');
              err.errno = 404;
              reject(err);
            }
          }).catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed in getLatestSubmission'));
      }
    });
  }*/

  getAll(idSubmission, sessionUser) {

    return new Promise((resolve, reject) => {
      if (this._typeCheck(idSubmission, 0) &&
        this._typeCheck(sessionUser, 0)) {

        this.db.query(GET_ALL_REVIEWS_FOR_SUBMISSION, [idSubmission, sessionUser])
          .then(res => resolve(res.rows))
          .catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  getOne(idSubmission, idReview, sessionUser) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(idSubmission, 0) &&
        this._typeCheck(idReview, 0)) {

        this.db.query(GET_ONE_REVIEW_FOR_SUBMISSION, [idSubmission, idReview, sessionUser])
          .then(res => {
            if (res.rows.length == 0) {
              let error = new Error(`Review not found ${idReview}`);
              error.errno = 404;
              reject(error);
            } else {
              resolve(res.rows[0]);
            }
          }).catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed in getOne'));
      }
    });
  }

  _checkCreate(idSubmission, sessionUser) {

    return new Promise((resolve, reject) => {
      this.db.query(CHECK_USER_CREATE, [idSubmission, sessionUser])
        .then(res => {
          if (res.rows[0])
            resolve();
          else {
            let err = Error('Unauthorized.');
            err.errno = 403;
            reject(err);
          }
        });
    });
  }

  create(idSubmission, review, sessionUser) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(idSubmission, 0) &&
        this._typeCheck(sessionUser, 0) &&
        this._typeCheck(review, {}) &&
        this._typeCheck(review.mark, 0) &&
        this._typeCheck(review.comment, '')) {

        this._checkCreate(idSubmission, sessionUser)
          .then(() => {

            this.db.query(CREATE_REVIEW, [review.mark, review.comment, sessionUser, idSubmission])
              .then(res => resolve(res.rows[0]))
              .catch(err => reject(err));

          }).catch(err => reject(err));

      } else {
        reject(Error('Type Assertion Failed'));
      }
    });
  }

  update(idSubmission, idReview, review, sessionUser) {
    return new Promise((resolve, reject) => {

      if (this._typeCheck(idSubmission, 0) &&
        this._typeCheck(idReview, 0) &&
        this._typeCheck(sessionUser, 0) &&
        this._typeCheck(review, {}) &&
        this._typeCheck(review.mark, 0) &&
        this._typeCheck(review.comment, '')) {

        this._checkCreate(idSubmission, sessionUser)
          .then(() => {

            this.getOne(idSubmission, idReview, sessionUser)
              .then(() => {

                this.db.query(UPDATE_REVIEW, [review.mark, review.comment, idReview])
                  .then(res => resolve(res.rows[0]))

                  .catch(err => reject(err));
              }).catch(err => reject(err));
          }).catch(err => reject(err));
      } else {
        reject(Error('Type Assertion Failed in Update'));
      }
    });
  }

  delete(idSubmission, idReview, sessionUser) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(idSubmission, 0) &&
        this._typeCheck(sessionUser, 0) &&
        this._typeCheck(idReview, 0)) {

        this._checkCreate(idSubmission, sessionUser)
          .then(() => {

            this.getOne(idSubmission, idReview, sessionUser)
              .then(() => {
                this.db.query(DELETE_REVIEW, [idReview])
                  .then(res => resolve())

                  .catch(err => reject(err));
              }).catch(err => reject(err));
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