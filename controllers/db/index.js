const {
	Client
} = require('pg');

const connString = process.env.DATABASE_URL;
const Task = require('./task.js');

function DB() {

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
	});

	self.task = new Task(self._piergiorgio);
}

const instance = new DB();
Object.freeze(instance);

module.exports = instance;