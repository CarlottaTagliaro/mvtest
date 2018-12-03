GET_ALL_ASSIGNMENTS = "SELECT * FROM Assign;"
GET_SINGLE_ASSIGNMENT = "SELECT * FROM Assign WHERE Id=$1;"

module.exports = class Assignment {

    constructor(db) {
        this._typeCheck(db, {});
        this._piergiorgio = db;
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this._piergiorgio.query(GET_ALL_ASSIGNMENTS)
                .then(res => {
                    resolve(res.rows);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            if (this._typeCheck(id, 0) && this._positiveId(id)) {
                this._piergiorgio.query(GET_SINGLE_ASSIGNMENT, [id])
                    .then(res => {
                        if (res.rows.length == 0) {
                            let error = new Error("Assignment not found");
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

    create(assignment) {}

    delete(id) {}


    edit(id, assignment) {

    }

    //////////////////////////////////////////////////////

    _positiveArray(a) {
        if (a.every(Number.isInteger) && this._positivity(a)) {
            return true;
        }
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
        return false;
    }

    _typeCheck(a, a_std_value) {
        if ((this.getType(a)) == this.getType((a_std_value))) {
            return true;
        }
        return false; //consistency in returns, not of real value;
    }

    getType(value) {
        return Object.prototype.toString.call(value)
            .replace(/^\[object |\]$/g, '').toLowerCase();
    };


}