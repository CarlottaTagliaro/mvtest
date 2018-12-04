const {
	Client
} = require('pg');

const connString = process.env.DATABASE_URL;

function DB() {
	const GET_ALL_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id_Type = Type.Id; ";
	const GET_SINGLE_TASK_QUERY = "SELECT Task.Id, Task.Text, Task.Points, Type.Name AS type FROM Task, Type WHERE Task.Id=$1 AND Task.Id_Type = Type.Id;"
	const CREATE_SINGLE_TASK_QUERY = "INSERT INTO Task(Id_Type, Text, Points) VALUES($1, $2, $3) RETURNING Id;"
	const DELETE_TASK_QUERY = "DELETE FROM Task WHERE id=$1;"
	const GET_ALL_EXAMS_QUERY = "SELECT * FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam;"
	const GET_SINGLE_EXAM_QUERY = "SELECT * FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam AND Exam.Id=$1;"
	const DELETE_EXAM_QUERY = "DELETE FROM Exam WHERE Id=$1; DELETE FROM ExamTask WHERE Id_Exam=$1;"

	var self = this;
	self._piergiorgio = new Client({
		connectionString: connString,
		ssl: true
	});

	self._piergiorgio.connect((err) => {
		if (err) {
			console.error('DB connection error: ', err.stack);
		} else {
			console.log('DB connected.');
		}
	});

	self._piergiorgio.on('error', (err) => {
		console.log("Mistake in db.js line 31")
		console.error('DB error: ', err.stack);
	})

	// TODO: parse text for answers (if not open question)
	self.getAllTasks = () => {
		return new Promise((resolve, reject) => {
			self._piergiorgio.query(GET_ALL_TASK_QUERY)
				.then(res => {
					resolve(res.rows);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	self.getOneTask = (id) => {
		return new Promise((resolve, reject) => {
			self._piergiorgio.query(GET_SINGLE_TASK_QUERY, [id])
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

	self.createTask = (task) => {
		console.log(CREATE_SINGLE_TASK_QUERY, [task.id_type, task.text, task.points]);
		return new Promise((resolve, reject) => {
			self._piergiorgio.query(CREATE_SINGLE_TASK_QUERY, [task.id_type, task.text, task.points])
				.then((res) => {
					resolve(res.rows[0]);
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	}

	self.deleteTask = (req, res, next) => {
		db.query(DELETE_TASK_QUERY, req.params.id).then(() => {
				res.status(200)
					.json({
						status: 'success',
						message: 'Removed one task'
					});
			})
			.catch((err) => {
				return next(err);
			});
	}

	self.editTask = (req, res, next) => {
		db.query('').then(() => {
			res.status(200);
		}).catch((err) => {
			res.status(500);
			return next(err);
		});
	}
}

const instance = new DB();
Object.freeze(instance);

module.exports = instance;