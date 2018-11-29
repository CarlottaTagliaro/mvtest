const GET_ALL_USERS = 'SELECT * FROM Users;';
const GET_ONE_USER = 'SELECT * FROM Users WHERE Id=$1';
const CREATE_USER = 'INSERT INTO Users(Email, Name) VALUES($1, $2) RETURNING Id;';
const UPDATE_USER = 'UPDATE Users SET Email = $1, Name = $2 WHERE Id = $3 RETURNING *;';
const DELETE_USER = 'DELETE FROM Users WHERE Id = $1;';

module.exports = class User {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.query(GET_ALL_USERS)
        .then(res => {
          resolve(res.rows);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getOne(id) {
    this._typeCheck(id, 1);

    return new Promise((resolve, reject) => {
      this.db.query(GET_ONE_USER, [id])
        .then(res => {
          if (res.rows.length == 0) {
            let error = new Error("User not found");
            error.errno = 404;
            reject(error);
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }

  create(user) {
    this._typeCheck(user, {});

    this._typeCheck(user.email, '');
    this._typeCheck(user.name, '');

    return new Promise((resolve, reject) => {
      this.db.query(CREATE_USER, [user.email, user.name])
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  update(id, user) {
    this._typeCheck(id, 0);
    this._typeCheck(user, {});

    this._typeCheck(user.email, '');
    this._typeCheck(user.name, '');

    return new Promise((resolve, reject) => {
      this.db.query(UPDATE_USER, [user.email, user.name, id])
        .then(res => {
          if (res.rows.length == 0) {
            let error = new Error("Task not found");
            error.errno = 404;
            reject(error);
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  delete(id) {
    this._typeCheck(id, 0);

    return new Promise((resolve, reject) => {
      this.getOne(id).then(() => {
        this.db.query(DELETE_USER, [id])
          .then(res => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }).catch(err => {
        reject(err);
      })
    });
  }

  //returns true when a has the same value of a_std_value
  //throws Error on assertion failed and returns false
  _typeCheck(a, a_std_value) {
    if ((this._getType(a)) == this._getType((a_std_value))) {
      return true;
    }
    throw new Error("Type assertion failed");
    return false; //consistency in returns, not of real value;
  }

  _getType(value) {
    return Object.prototype.toString.call(value)
      .replace(/^\[object |\]$/g, '').toLowerCase();
  };
}