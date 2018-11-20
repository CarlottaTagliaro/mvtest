const {
	Client
} = require('pg');



const connString = process.env.DATABASE_URL;

function DB() {
	const GET_ALL_TASK_QUERY = "SELECT * FROM Task,Type WHERE Task.Id_Type = Type.Id;";
	const GET_SINGLE_TASK_QUERY = "SELECT * FROM Task WHERE id=$1;"
	const CREATE_SINGLE_TASK_QUERY = "INSERT INTO Task(Id_Type, Text) VALUES(${id_type}, ${text}) RETURNING Id;"
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
		console.error('DB error: ', err.stack);
	})

	self.getAllTasks = (req, res, next) => {
		self._piergiorgio.query(GET_ALL_TASK_QUERY)
			.then((data) => {
				/*res.status(200).json({
					status: 'success',
					data: tasks
				})*/
				res.locals.data = data;
				next();
			})
			.catch((err) => {
				return next(err);
			});
	}

	self.getOneTask = (req, res, next) => {
		let taskID = req.params.id;
		self._piergiorgio.query(GET_SINGLE_TASK_QUERY, taskID).then((data) => {
			res.status(200).json({
				status: 'success',
				data: data,
				message: 'got one of them'
			});

		}).catch((err) => {
			return next(err);
		});
	}

	self.createTask = (req, res, next) => {
		db.query(CREATE_SINGLE_TASK_QUERY, req.body, function (err, result) {
				if (err) throw err;
				let id = result.row[0].Id;
			}).then(() => {
				res.status(201)
					.json({
						status: 'Created',
						message: 'Inserted one task',
						idTask: id
					});
			})
			.catch((err) => {
				return next(err);
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