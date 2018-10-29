const {
	Client
} = require('pg');

module.exports = class DB {
	constructor(connString) {
		this._piergiorgio = new Client(connString);

		this._piergiorgio.connect((err) => {
			if (err) {
				console.error('DB connection error: ', err.stack);
			} else {
				console.log('DB connected.');
			}
		});

		this._piergiorgio.on('error', (err) => {
			console.error('DB error: ', err.stack);
		})
	}

	getAllTasks(req, res, next) {
		this._piergiorgio.any('SELECT * FROM Tasks')
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

	getOneTask(req, res, next) {
		let taskID = req.params.id;

		this._piergiorgio.once('SELECT * FROM Tasks WHERE id=$1', taskID).then((data) => {
			res.status(200).json({
				status: 'success',
				data: data,
				messgage: 'got one of \'em'
			});

		}).catch((err) => {
			return next(err);
		});
	}

	createTask(req, res, next) {
		db.none('INSERT INTO Tasks(id_type, text)' +
				'VALUES(${id_type}, ${text})',
				req.body)
			.then(function () {
				res.status(200)
					.json({
						status: 'success',
						message: 'Inserted one task'
					});
			})
			.catch(function (err) {
				return next(err);
			});
	}
}