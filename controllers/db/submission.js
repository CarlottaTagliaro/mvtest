const GET_ALL_SUBMISSION = "SELECT * FROM Submission WHERE Id_Assign=$1;"
const DELETE_SUBMISSION = "DELETE FROM Submission WHERE Id_Assign=$1 AND Id_User=$2;"
const CREATE_SUBMISSION = "INSERT INTO Submission(Time,Answer,Id_Assign,Id_User,Id_Task) VALUES($1,$2,$3,$4,$5) RETURNING Id;"
const CHECK_USER = "SELECT * FROM Class,ClassUser,Assign WHERE ClassUser.Id_User=$1 AND Class.Id=ClassUser.Id_Class AND Assign.Id_Class=Class.Id AND Assign.Id=$2;"
const CHECK_TASK = "SELECT * FROM Assign,Exam,ExamTask WHERE Assign.Id=$1 AND Assign.Id_Exam=Exam.Id AND ExamTask.Id_Task=$2 AND Exam.Id=ExamTask.Id_Exam;"

module.exports = class Submission {

    constructor(db) {
        this._typeCheck(db, {});
        this._piergiorgio = db;
    }

    getAll(id_assign) {
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(GET_ALL_SUBMISSION, [id_assign])
                .then(res => {
                    resolve(res.rows);
                })
                .catch(err => reject(err));
        });
    }

    create(id_assign, submission) {
        return new Promise((resolve, reject) => {
            if (this._typeCheck(submission.answer, 'aa') &&
                this._typeCheck(submission.id_user, 0) && this._positiveId(submission.id_user) &&
                this._typeCheck(id_assign, 0) && this._positiveId(id_assign) &&
                this._typeCheck(submission.id_task, 0) && this._positiveId(submission.id_task)) {

                let datetime = new Date().toISOString();

                this._piergiorgio.query(CHECK_USER, [submission.id_user, id_assign]) //check if user is in the class
                    .then((utente) => {
                        if (utente.rows.length == 0) {
                            let error = new Error("User not in class");
                            error.code = 404;
                            reject(error);
                        } else {
                            this._piergiorgio.query(CHECK_TASK, [id_assign, submission.id_task]) //check task in exam
                                .then((task) => {
                                    if (task.rows.length == 0) {
                                        let error = new Error("Task not in exam");
                                        error.code = 404;
                                        reject(error);
                                    } else {
                                        this._piergiorgio.query(CREATE_SUBMISSION, [datetime, submission.answer, id_assign, submission.id_user, submission.id_task])
                                            .then((res) => {
                                                console.warn('CREATED ', res.rows[0]);
                                                resolve(res.rows[0]);
                                            })
                                            .catch(err => reject(err));
                                    }
                                })
                                .catch(err => reject(err));
                        }
                    })
                    .catch(err => reject(err));
            } else {
                reject(Error("Type Assertion Failed"));
            }
        })
    }

    delete(id_assign, id_user) {
        return new Promise((resolve, reject) => {
            if (this._typeCheck(id_assign, 0) && this._positiveId(id_assign) &&
                this._typeCheck(id_user, 0) && this._positiveId(id_user)) {
                this._piergiorgio.query(DELETE_SUBMISSION, [id_assign, id_user])
                    .then(() => {
                        resolve();
                    })
                    .catch(err => reject(err));
            } else {
                reject(Error("Type Assertion Failed"));
            }
        })
    }

    //////////////////////////////////////////////////////

    _positiveId(a) {
        if (a > 0) {
            return true;
        }
        return false;
    }

    _typeCheck(a, a_std_value) {
        if ((this.getType(a)) == this.getType((a_std_value))) {
            return true;
        }
        return false;
    }

    getType(value) {
        return Object.prototype.toString.call(value)
            .replace(/^\[object |\]$/g, '').toLowerCase();
    };


}