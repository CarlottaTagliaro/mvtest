const {
	Client
} = require('pg');

module.exports = class DB {
	constructor(connString) {
		this._client = new Client(connString);

		this._client.connect((err) => {
			if (err) {
				console.error('DB connection error: ', err.stack);
			} else {
				console.log('DB connected.');
			}
		});

		this._client.on('error', (err) => {
			console.error('DB error: ', err.stack);
		})
	}
}