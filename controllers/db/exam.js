const GET_ALL_EXAMS_QUERY = "SELECT * FROM Exam;"
const GET_SINGLE_EXAM_QUERY = "SELECT Exam.Id, Exam.Id_Creator, ExamTask.Id_Task FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam AND Exam.Id=$1;"
const DELETE_EXAM_QUERY = "DELETE FROM Exam WHERE Id=$1;"
const DELETE_TASKEXAM_QUERY = "DELETE FROM ExamTask WHERE Id_Exam=$1;";
const CREATE_EXAM_QUERY = "INSERT INTO Exam(Id_Creator) VALUES($1) RETURNING Id;";
const INSERT_TASK_IN_EXAM = "INSERT INTO ExamTask(Id_Exam, Id_Task) VALUES($1,$2)";

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
        this._typeCheck(id, 0);
        this._positiveId(id);

        var Id = parseInt(id);
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(GET_SINGLE_EXAM_QUERY, [Id])
                .then(res => {
                    console.warn('succ')
                    if (res.rows.length == 0) {
                        let error = new Error("Exam not found");
                        error.errno = 404;
                        reject(error);
                    } else {
                        var tasks = [];
                        for (let row of res.rows) {
                            tasks.push(row.id_task);
                        }
                        var exam = {
                            id: res.rows[0].id,
                            id_creator: res.rows[0].id_creator,
                            tasks: tasks
                        }
                        console.log('resolving', exam)
                        resolve(exam);
                    }
                })
                .catch(err => {
                    console.warn('rejecting', err)
                    reject(err);
                });
        });
    }

    create(exam) {
        this._typeCheck(exam, {});
        this._typeCheck(exam.id_creator, 0);
        this._positiveId(exam.id_creator);
        this._typeCheck(exam.tasks, []);
        this._positiveArray(exam.tasks);

        return new Promise((resolve, reject) => {
            let id;
            let Id;
            this._piergiorgio.query(CREATE_EXAM_QUERY, [exam.id_creator])
                .then(res => {
                    id = res.rows[0].id;
                    Id = res.rows[0];
                    //console.warn(id);
                    for (var id_task of exam.tasks) {
                        this._typeCheck(id_task, 1);
                        this._positiveId(id_task);
                        this._piergiorgio.query(INSERT_TASK_IN_EXAM, [id, id_task]);
                    };
                }).then(res => {
                    resolve(Id);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    delete(id) {
        this._typeCheck(id, 0);
        this._positiveId(id);

        return new Promise((resolve, reject) => {
            this.getOne(id).then(() => {
                this._piergiorgio.query(DELETE_EXAM_QUERY, [id])
                    .then(res => {
                        this._piergiorgio.query(DELETE_TASKEXAM_QUERY, [id])
                            .then(res => {
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

    edit(id, exam) {
        this._typeCheck(id, 1);
        this._positiveId(id);
        this._typeCheck(exam, {});
        this._typeCheck(exam.id_creator, 1);
        this._positiveId(exam.id_creator);
        this._typeCheck(exam.tasks, []);
        this._positiveArray(exam.tasks);

        return new Promise((resolve, reject) => {
            this.getOne(id).then(() => {
                this._piergiorgio.query(DELETE_TASKEXAM_QUERY, [id])
                    .then(res => {
                        for (var id_task of exam.tasks) {
                            this._typeCheck(id_task, 1);
                            this._positiveId(id_task);
                            this._piergiorgio.query(INSERT_TASK_IN_EXAM, [id, id_task]);
                        };
                        resolve(res.rows);

                    })
                    .catch(err => {
                        reject(err);
                    });
            }).catch(err => {
                reject(err)
            });
        });
    }

    _positiveArray(a) {
        if (a.every(Number.isInteger) && this._positivity(a)) {
            return true;
        }

        throw new Error("Negative ID");
        return false;
    }

    _positivity(a) {
        for (var item of a) {
            if (item <= 0)
                return false;
        }
        return true;
    }

    _positiveId(a) {
        if (a > 0) {
            return true;
        }

        throw new Error("Negative ID");
        return false;
    }

    _typeCheck(a, a_std_value) {
        if ((this.getType(a)) == this.getType((a_std_value))) {
            return true;
        }

        throw new Error("Type assertion failed");
        return false; //consistency in returns, not of real value;
    }

    getType(value) {
        return Object.prototype.toString.call(value)
            .replace(/^\[object |\]$/g, '').toLowerCase();
    };

}