const {
	Client
} = require('pg');

const connString = process.env.DATABASE_URL;

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
	})

	self.getAllTasks = (req, res, next) => {
		self._piergiorgio.query('SELECT * FROM Task')
			.then((data) => {
				res.locals.data = data;
				next();
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
				res.status(201)
					.json({
						status: 'success',
						message: 'Inserted one task'
					});
			})
			.catch((err) => {
				return next(err);
			});
	}

	self.deleteTask = (req, res, next) => {
		db.query('DELETE FROM Task WHERE id=$1', req.body.id)
			.then(() => {
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