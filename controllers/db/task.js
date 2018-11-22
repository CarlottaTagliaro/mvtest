const GET_ALL_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id_Type = Type.Id; ";
const GET_SINGLE_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id=$1 AND Task.Id_Type = Type.Id;"
const CREATE_SINGLE_TASK_QUERY = "INSERT INTO Task(Id_Type, Text, Points) VALUES($1, $2, $3) RETURNING Id;"
const DELETE_TASK_QUERY = "DELETE FROM Task WHERE id=$1;"

module.exports = class Task {
	constructor(db) {
		this._piergiorgio = db;
	}

	getAll() {
		// TODO: parse text for answers (if not open question)
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(GET_ALL_TASK_QUERY)
				.then(res => {
					resolve(res.rows);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getOne(id) {
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(GET_SINGLE_TASK_QUERY, [id])
				.then((res) => {
					if (res.rows.length == 0) {
						let error = new Error("Task not found");
						error.errno = 404;
						reject(error);
					} else {
						resolve(res.rows[0]);
					}
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		});
	}

	create(task) {
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(CREATE_SINGLE_TASK_QUERY, [task.id_type, task.text, task.points])
				.then((res) => {
					resolve(res.rows[0]);
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(DELETE_TASK_QUERY, [id])
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}