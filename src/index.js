const PORT = process.env.PORT || 3000;

const DB = require('./db.js');
const connString = 'postgres://eewihfqsafueky:eebe4a30c72b77efeecc7a5e4fac12d245b74747c629e78ee4258c4aa3fbd5a2@ec2-107-22-174-187.compute-1.amazonaws.com:5432/d490aujo856j8c'
const db = new DB(connString);

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => console.log('mvtest listening on port ' + PORT));