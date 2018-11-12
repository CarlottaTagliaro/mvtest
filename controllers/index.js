const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const apiV1 = require('../routes/v1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('view engine', 'pug');

app.use('/', require('../routes/site.js'));

app.use('/api', apiV1);
app.use('/api/v1', apiV1);

app.listen(PORT, () => console.log('mvtest listening on port ' + PORT));