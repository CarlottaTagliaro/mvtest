const {
	Client
} = require('pg');

const connString = 'postgres://eewihfqsafueky:eebe4a30c72b77efeecc7a5e4fac12d245b74747c629e78ee4258c4aa3fbd5a2@ec2-107-22-174-187.compute-1.amazonaws.com:5432/d490aujo856j8c'

function DB() {
	var self = this;
	self._piergiorgio = new Client(connString);

	self._piergiorgio.connect((err) => {
		if (err) {
			console.error('DB connection error: ', err.stack);
		} else {
			console.log('DB connected.');
		}
		console.log(this);
	});

	self._piergiorgio.on('error', (err) => {
		console.error('DB error: ', err.stack);
	})

	self.getAllTasks = (req, res, next) => {
		console.log(self);
		self._piergiorgio.query('SELECT * FROM Task')
			.then((data) => {
				res.status(200)
					.json({
						status: 'success',
						data: data,
						message: 'got \'em all'
					});
			})
			.catch((err) => {
				return next(err);
			});
	}

	self.getOneTask = (req, res, next) => {
		let taskID = req.params.id;

		self._piergiorgio.query('SELECT * FROM Task WHERE id=$1', taskID).then((data) => {
			res.status(200).json({
				status: 'success',
				data: data,
				messgage: 'got one of \'em'
			});

		}).catch((err) => {
			return next(err);
		});
	}

	self.createTask = (req, res, next) => {
		db.query('INSERT INTO Task(id_type, text)' +
				'VALUES(${id_type}, ${text})',
				req.body)
			.then(() => {
				res.status(200)
					.json({
						status: 'success',
						message: 'Inserted one task'
					});
			})
			.catch((err) => {
				return next(err);
			});
	}
}

module.exports = DB;