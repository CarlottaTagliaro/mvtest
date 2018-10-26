var express = require('express'),
	router = express.Router();

router.get('/tasks', (req, res) => {
	res.send([]);
});

router.get('/tasks/:id', (req, res) => {
	res.send({});
});

module.exports = router;