const GET_ALL_ASSIGNMENTS = 'SELECT * FROM Assign;'
const GET_SINGLE_ASSIGNMENT = 'SELECT * FROM Assign WHERE Id=$1;'
const DELETE_ASSIGNMENT = 'DELETE FROM Assign WHERE Id=$1;'
const CREATE_ASSIGNMENT = 'INSERT INTO Assign(Deadline,Review,Id_Teacher,Id_Exam,Id_Class) VALUES($1,$2,$3,$4,$5) RETURNING Id;'
const UPDATE_ASSIGNMENT = 'UPDATE Assign SET Deadline=$1, Review=$2, Id_Exam=$3, Id_Class=$4 WHERE Id=$5 RETURNING *;'

module.exports = class Assignment {
  constructor (db) {
    this._typeCheck(db, {})
    this._piergiorgio = db
  }

  getAll () {
    return new Promise((resolve, reject) => {
      this._piergiorgio.query(GET_ALL_ASSIGNMENTS)
        .then(res => {
          resolve(res.rows)
        })
        .catch(err => reject(err))
    })
  }

  getOne (id) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 0)) {
        this._piergiorgio.query(GET_SINGLE_ASSIGNMENT, [id])
          .then(res => {
            if (res.rows.length === 0) {
              let error = new Error('Assignment not found')
              error.errno = 404
              reject(error)
            } else {
              resolve(res.rows[0])
            }
          })
          .catch(err => reject(err))
      } else {
        reject(Error('Type Assertion Failed'))
      }
    })
  }

  create (assign) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(assign.review, true) &&
          !Date.parse(assign.deadline).isNaN &&
          this._typeCheck(assign.id_teacher, 0) && this._positiveId(assign.id_teacher) &&
          this._typeCheck(assign.id_exam, 0) && this._positiveId(assign.id_exam) &&
          this._typeCheck(assign.id_class, 0) && this._positiveId(assign.id_class)) {
        this._piergiorgio.query(CREATE_ASSIGNMENT, [assign.deadline, assign.review, assign.id_teacher, assign.id_exam, assign.id_class])
          .then((res) => {
            console.warn('CREATED ', res.rows[0])
            resolve(res.rows[0])
          })
          .catch(err => reject(err))
      } else {
        reject(Error('Type Assertion Failed'))
      }
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 0) && this._positiveId(id)) {
        this._piergiorgio.query(DELETE_ASSIGNMENT, [id])
          .then(() => {
            resolve()
          })
          .catch(err => reject(err))
      } else {
        reject(Error('Type Assertion Failed'))
      }
    })
  }

  edit (id, assign) {
    return new Promise((resolve, reject) => {
      if (this._typeCheck(id, 0) && this._positiveId(id)) {
        this.getOne(id).then(() => {
          this._piergiorgio.query(UPDATE_ASSIGNMENT, [assign.deadline, assign.review, assign.id_exam, assign.id_class, id])
            .then(res => {
              resolve(res.rows[0])
            })
            .catch(err => reject(err))
        })
          .catch(err => reject(err))
      } else {
        reject(Error('Type Assertion Failed'))
      }
    })
  }

  /// ///////////////////////////////////////////////////

  _positiveId (a) {
    if (a > 0) {
      return true
    }
    return false
  }

  _typeCheck (a, a_std_value) {
    if ((this.getType(a)) === this.getType((a_std_value))) {
      return true
    }
    return false
  }

  getType (value) {
    return Object.prototype.toString.call(value)
      .replace(/^\[object |\]$/g, '').toLowerCase()
  };
}
