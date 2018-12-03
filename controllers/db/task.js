const GET_ALL_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id_Type = Type.Id;";
const GET_SINGLE_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id=$1 AND Task.Id_Type = Type.Id;";
const CREATE_SINGLE_TASK_QUERY = "INSERT INTO Task(Id_Type, Text, Points) VALUES($1, $2, $3) RETURNING Id;";
const UPDATE_TASK_QUERY = "UPDATE Task SET Id_Type=$1, Text=$2, Points=$3 WHERE Id=$4 RETURNING *;";
const DELETE_TASK_QUERY = "DELETE FROM Task WHERE id=$1;";
const GET_USER_RIGHTS_FOR_TASK = "SELECT Id_User, Owner, Modifier FROM Rights WHERE Id_Task = $1;";
const SET_USER_RIGHTS_FOR_TASK = "INSERT INTO Rights(Id_Task, Id_User, Owner, Modifier) VALUES($1, $2, $3, $4) RETURNING *;";
const DELETE_RIGHTS_FOR_TASK = "DELETE FROM Rights WHERE Id_Task = $1;";

module.exports = class Task {
	constructor(db) {
		this._typeCheck(db, {});
		this._piergiorgio = db;
	}

	getAll() {
		return new Promise((resolve, reject) => {
			this._piergiorgio.query(GET_ALL_TASK_QUERY)
				.then(res => {
					for (let i in res.rows) {
						let text = JSON.parse(res.rows[i].text);
						if (text.choices)
							res.rows[i].choices = text.choices;
						res.rows[i].text = text.question;
					}
					resolve(res.rows);
				})
				.catch(err => reject(err));
		});
	}

	getOne(id) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0)) {
				this._piergiorgio.query(GET_SINGLE_TASK_QUERY, [id])
					.then(res => {
						if (res.rows.length == 0) {
							let error = new Error('Task ' + id + ' not found');
							error.errno = 404;
							reject(error);
						} else {
							this.getRights(id).then(rights => {
								res.rows[0].users = [];
								for (let right of rights) {
									res.rows[0].users.push({
										id_user: right.id_user,
										owner: right.owner,
										modifier: right.modifier
									});
								}

								resolve(res.rows[0]);
							}).catch(err => reject(err));
						}
					})
					.catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	getRights(id) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0)) {
				this._piergiorgio.query(GET_USER_RIGHTS_FOR_TASK, [id])
					.then(res => {
						if (res.rows.length > 0) {
							resolve(res.rows);
						} else {
							let err = new Error('Rights not found for task ' + id)
							reject(err);
						}
					}).catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	addRights(id, rights) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0) &&
				this._typeCheck(rights, []) &&
				this._typeCheck(rights[0], {})) {

				(async () => {
					let results = [];

					for (let right of rights) {
						let args = [id, right.id_user, right.owner, right.modifier];
						await this._piergiorgio.query(SET_USER_RIGHTS_FOR_TASK, args)
							.then(res => {
								results.push(res.rows[0]);
							}).catch(err => reject(err));
					}
					return results;
				})().then(res => resolve(res));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	deleteRights(id) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0)) {

				this.getOne(id).then(() => {

					this._piergiorgio.query(DELETE_RIGHTS_FOR_TASK, [id])
						.then(res => {
							resolve();
						}).catch(err => {
							reject(err);
						});

				}).catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	create(task) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(task, {}) &&
				this._typeCheck(task.id_type, 0) &&
				this._typeCheck(task.text, '') &&
				this._typeCheck(task.points, 0) &&
				this._typeCheck(task.users, [])) {

				this._piergiorgio.query(CREATE_SINGLE_TASK_QUERY, [task.id_type, task.text, task.points])
					.then(res => {
						this.addRights(res.rows[0].id, task.users).then(rights => {
							resolve(res.rows[0]);
						}).catch(err => {
							reject(err);
						});
					}).catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	update(id, task) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0) &&
				this._typeCheck(task, {}) &&
				this._typeCheck(task.users, []) &&
				this._typeCheck(task.id_type, 0) &&
				this._typeCheck(task.text, '') &&
				this._typeCheck(task.points, 0)) {

				this.getOne(id).then(() => {

					this._piergiorgio.query(UPDATE_TASK_QUERY, [task.id_type, task.text, task.points, id])
						.then(res => {

							this.deleteRights(id)
								.then(() => {

									this.addRights(id, task.users)
										.then(rights => {
											res.rows[0].users = rights;
											resolve(res.rows[0]);
										}).catch(err => reject(err));

								}).catch(err => reject(err));

						}).catch(err => reject(err));

				}).catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			if (this._typeCheck(id, 0)) {

				this.getOne(id).then(() => {

					this._piergiorgio.query(DELETE_TASK_QUERY, [id])
						.then(res => {
							resolve();
						}).catch(err => reject(err));

				}).catch(err => reject(err));
			} else {
				reject(Error('Type Assertion Failed'));
			}
		});
	}

	//returns true when a has the same value of a_std_value
	//throws Error on assertion failed and returns false
	_typeCheck(a, a_std_value) {
		if ((this.getType(a)) == this.getType((a_std_value))) {
			return true;
		}
		//throw new Error("Type assertion failed");
		return false; //consistency in returns, not of real value;
	}

	getType(value) {
		return Object.prototype.toString.call(value)
			.replace(/^\[object |\]$/g, '').toLowerCase();
	};
}