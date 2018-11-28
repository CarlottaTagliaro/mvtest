const USERS_RETRIVIAL = 'SELECT * FROM Users;'
const USER_CREATION = 'INSERT INTO Users VALUES ($1, $2, $3);'
const USER_UPDATING = 'UPDATE Users user SET user.Email = $2, user.Name = $3 WHERE user.Id = $1'
const USER_DELETION = 'DELETE FROM Users user WHERE user.Id = $1'

class User {
  constructor (db) {
    this.db = db
  }

  getAll () {
    return new Promise((resolve, reject) => {
      this.db.query(USERS_RETRIVIAL)
        .then((res) => {
          resolve(res.rows)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  create (user) {
    return new Promise((resolve, reject) => {
      this.db.query(USER_CREATION, [user.id, user.email, user.name])
        .then((res) => {
          resolve(res.rows)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  update (user) {
    return new Promise((resolve, reject) => {
      this.db.query(USER_UPDATING, [user.id, user.email, user.name])
        .then((res) => {
          resolve(res.rows)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      this.db.query(USER_DELETION, id)
        .then((res) => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = User
