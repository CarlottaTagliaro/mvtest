const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const session = require('express-session')

const apiV1 = require('./routes/v1');

global.__basedir = __dirname;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use((err, req, res, next) => {
	console.error('ERROR');
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.use('/', require('./routes'));

app.use('/api', apiV1);
app.use('/api/v1', apiV1);

module.exports = app;