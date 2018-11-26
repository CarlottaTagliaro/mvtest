const GET_ALL_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id_Type = Type.Id;";
const GET_SINGLE_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id=$1 AND Task.Id_Type = Type.Id;"
const CREATE_SINGLE_TASK_QUERY = "INSERT INTO Task(Id_Type, Text, Points) VALUES($1, $2, $3) RETURNING Id;"
const UPDATE_TASK_QUERY = "UPDATE Task SET Id_Type=$1, Text=$2, Points=$3 WHERE Id=$4 RETURNING *;"
const DELETE_TASK_QUERY = "DELETE FROM Task WHERE id=$1;"

module.exports = class Task {
	constructor(db) {
		this._typeCheck(db, {});
		this._piergiorgio = db;
	}

	getAll() {
		// TODO: parse text for answers (if not open question)
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(GET_ALL_TASK_QUERY)
				.then(res => {
					resolve(res.rows);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	}

	getOne(id) {
		this._typeCheck(id, 0);

		return new Promise((resolve, reject) => {
			this._piergiorgio.query(GET_SINGLE_TASK_QUERY, [id])
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
					console.error(err);
					reject(err);
				});
		});
	}

	create(task) {
		this._typeCheck(task, {});

		this._typeCheck(task.id_type, 0);
		this._typeCheck(task.text, '');
		this._typeCheck(task.points, 0);

		return new Promise((resolve, reject) => {
			this._piergiorgio.query(CREATE_SINGLE_TASK_QUERY, [task.id_type, task.text, task.points])
				.then(res => {
					resolve(res.rows[0]);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	}

	edit(id, task) {
		this._typeCheck(id, 0);
		this._typeCheck(task, {});

		this._typeCheck(task.id_type, 0);
		this._typeCheck(task.text, '');
		this._typeCheck(task.points, 0);

		return new Promise((resolve, reject) => {
			this.getOne(id).then(() => {
				this._piergiorgio.query(UPDATE_TASK_QUERY, [task.id_type, task.text, task.points, id])
					.then(res => {
						resolve(res.rows[0]);
					})
					.catch(err => {
						reject(err);
					});
			}).catch(err => {
				console.error(err);
				reject(err)
			});
		});
	}

	delete(id) {
		this._typeCheck(id, 0);

		return new Promise((resolve, reject) => {
			this.getOne(id).then(() => {
				this._piergiorgio.query(DELETE_TASK_QUERY, [id])
					.then(res => {
						resolve();
					})
					.catch(err => {
						reject(err);
					});
			}).catch(err => {
				console.error(err);
				reject(err);
			});
		});
	}

	//returns true when a has the same value of a_std_value
	//throws Error on assertion failed and returns false
	_typeCheck(a, a_std_value) {
		if ((typeof a) === typeof (a_std_value)) {
			return true;
		}
		throw new Error("Type assertion failed");
		return false; //consistency in returns, not of real value;
	}
}