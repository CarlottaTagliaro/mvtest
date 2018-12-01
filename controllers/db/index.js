const {
	Client
} = require('pg');

const connString = process.env.DATABASE_URL;
const Task = require('./task.js');
const Exam = require('./exam.js');

function DB() {
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

	self.close = () => {
		self._piergiorgio.end();
	};

	self.task = new Task(self._piergiorgio);
	self.exam = new Exam(self._piergiorgio);
}

const instance = new DB();
Object.freeze(instance);

module.exports = instance;