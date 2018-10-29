const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('view engine', 'pug');

app.use('/', require('../routes/site.js'));
app.use('/v1', require('../routes/v1.js'));

app.listen(PORT, () => console.log('mvtest listening on port ' + PORT));