const GET_ALL_EXAMS_QUERY = "SELECT * FROM Exam;"
const GET_SINGLE_EXAM_QUERY = "SELECT Exam.Id,Exam.Id_Creator,ExamTask.Id_Task FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam AND Exam.Id=$1;"
const DELETE_EXAM_QUERY = "DELETE FROM Exam WHERE Id=$1;"
const DELETE_TASKEXAM_QUERY = " DELETE FROM ExamTask WHERE Id_Exam=$1;";
const CREATE_EXAM_QUERY = "INSERT INTO Exam(Id_Creator) VALUES ($1) RETURNING Id";
const INSERT_TASK_IN_EXAM = "INSERT INTO Exam(Id_Exam,Id_Task) VALUES ($1,$2)";
const UPDATE_EXAM_QUERY = "DELETE FROM ExamTask WHERE Id_Exam=$1;"

module.exports = class Exam {

    constructor(db) {
        this._typeCheck(db, {});
        this._piergiorgio = db;
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(GET_ALL_EXAMS_QUERY)
                .then(res => {
                    resolve(res.rows);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getOne(id) {
        //this._typeCheck(id,1); -> is it necessary or the tests are enough?
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(GET_SINGLE_EXAM_QUERY, [id])
                .then(res => {
                    if (res.rows.length == 0) {
                        let error = new Error("Exam not found");
                        error.errno = 404;
                        reject(error);
                    } else {
                        var tasks = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            tasks.push(res.rows[i].id_task);
                        }
                        var exam = {
                            id : res.rows[0].id,
                            id_creator : res.rows[0].id_creator,
                            tasks: tasks
                        }
                        resolve(exam);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    create(exam) {
        //this._typeCheck(exam, {});
        //this._typeCheck(exam.id_creator,1);
        //this._typeCheck(exam.tasks, []);
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(CREATE_EXAM_QUERY, [exam.id_creator])
                .then(res => {
                    let id = res.rows[0];
                    for (id_task of exam.tasks) {
                        //this._typeCheck(id_task,1);
                        this._piergiorgio.query(INSERT_TASK_IN_EXAM, [id, id_task]);
                    };
                    resolve(res.rows[0]);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.getOne(id).then(() => {
                this._piergiorgio.query(DELETE_EXAM_QUERY, [id])
                    .then(res => {
                        this._piergiorgio.query(DELETE_TASKEXAM_QUERY, [id])
                        .then (res => {
                            resolve();
                        })
                    })
                    .catch(err => {
                        reject(err);
                    });
            }).catch(err => {
                reject(err);
            });
        });
    }

    _typeCheck(a, a_std_value) {
        if ((typeof a) === typeof (a_std_value)) {
            return true;
        }
        throw new Error("Type assertion failed");
        return false; //consistency in returns, not of real value;
    }

    edit(id, exam) {

    }

}