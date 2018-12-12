// returns true when a has the same value of a_std_value
// throws Error on assertion failed and returns false
function typecheck (a, a_std_value) {
  if ((typeof a) === typeof (a_std_value)) {
    return true
  }
  throw new Error('Type assertion failed')
}
function ge (v, t) {
  return v >= t
}
// The view that gives access to the db
// working with the classes
// the proposed functions are get, edit, and delete
function class_v (_db) {
  typecheck((_db || {})['query'], function () {})
  const GET_ALL_CLASSES_QUERY = 'SELECT Id, Name FROM Class;'
  const GET_CLASS_BY_ID_QUERY = 'SELECT Id, Name, Id_User FROM Class,ClassUser WHERE Id=$1 AND Class.Id=ClassUser.Id_Class;'
  const CREATE_CLASS_QUERY = 'INSERT INTO Class(Name) VALUES($1) RETURNING Id;'
  const INSERT_USER_IN_CLASS = 'INSERT INTO ClassUser(Id_Class,Id_User) VALUES ($1,$2);'
  const EDIT_CLASS_QUERY = 'UPDATE Class SET Name = $2 WHERE Id = $1;'
  const DELETE_CLASSUSER_QUERY = 'DELETE FROM ClassUser WHERE Id_Class=$1;'
  const DELETE_CLASS_QUERY = 'DELETE FROM Class WHERE Id = $1'
  let self = this
  self.db = _db

  self.getAll = () => {
    return new Promise((res, rej) =>
      self.db.query(GET_ALL_CLASSES_QUERY)
        .then(_r => res(_r.rows))
        .catch(_e => rej(_e))
    )
  }

  self.getById = _id => {
    typecheck(_id, 0)
    if (!ge(_id, 0)) {
      return new Promise((res, rej) => {
        let error = new Error('Wrong number')
        error.code = 404
        rej(error)
      })
    }
    return new Promise((res, rej) => {
      self.db.query(GET_CLASS_BY_ID_QUERY, [_id])
        .then(_r => {
          if (_r.rows.length === 0) {
            let error = new Error('Class not found')
            error.code = 404
            rej(error)
          }

          let users = _r.rows.map(r => {
            return r.id_user
          })

          let _c = {
            id: _r.rows[0].id,
            name: _r.rows[0].name,
            users: users
          }
          res(_c)
        })
        .catch(_e => rej(_e))
    })
  }

  self.create = _c => {
    typecheck(_c['name'], '')
    return new Promise((res, rej) => {
      self.db.query(CREATE_CLASS_QUERY, [_c.name])
        .then(_res => {
          var queries = []
          var id = _res.rows[0]
          for (let user of _c.users) {
            queries.push(self.db.query(INSERT_USER_IN_CLASS, [_res.rows[0].id, user.id]))
          };

          Promise.all(queries)
            .then(() => {
              res(id)
            })
        })
        .catch(_err => rej(_err))
    })
  }

  self.edit = (_id, _c) => {
    typecheck(_id, 0)
    ge(_id, 0)
    typecheck(_c['name'], '')
    return new Promise((res, rej) => {
      self.db.query(DELETE_CLASSUSER_QUERY, [_id])
        .then(_res => {
          var queries = []
          queries.push(self.db.query(EDIT_CLASS_QUERY, [_id, _c.name]))
          for (let id_user of _c.users) {
            queries.push(self.db.query(INSERT_USER_IN_CLASS, [_id, id_user]))
          };

          Promise.all(queries)
            .then((_res) => {
              _c.id = _id
              res(_c)
            })
        })
        .catch(_err => rej(_err))
    })
  }

  self.delete = _id => {
    typecheck(_id, 0)
    ge(_id, 0)
    return new Promise((res, rej) => {
      self.db.query(DELETE_CLASS_QUERY, [_id])
        .then(_res => res())
        .catch(_err => rej(_err))
    })
  }
}

module.exports = class_v
