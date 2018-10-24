const PORT = 3000;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => console.log('mvtest listening on port ' + PORT))