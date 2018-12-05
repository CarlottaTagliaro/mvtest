const {
	Client
} = require('pg');

const connString = process.env.DATABASE_URL;
const Task = require('./task.js');
const Exam = require('./exam.js');
const User = require('./user.js');
const Assignment = require('./assignment.js');
const Class_v = require('./class_view.js');
const Submission = require('./submission.js');

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
		//self._piergiorgio.on('drain', self._piergiorgio.end.bind(self._piergiorgio));
	};

	self.task = new Task(self._piergiorgio);
	self.exam = new Exam(self._piergiorgio);
	self.user = new User(self._piergiorgio);
	self.assignment = new Assignment(self._piergiorgio);
	self.class_v = new Class_v(self._piergiorgio);
	self.submission = new Submission(self._piergiorgio);


	self._piergiorgio.multiquery = function (qas) {
		to_exec = [];
		for (query_args of qas) {
			q = query_args[0];
			a = query_args[1];
			to_exec.push(self._piergiorgio.query(q, a));
		}
		console.warn(">>>>>>>>>>>>>>>>>>>>>>>>>" + to_exec);
		return Promise.all(to_exec);
	}
}

const instance = new DB();
Object.freeze(instance);

module.exports = instance;