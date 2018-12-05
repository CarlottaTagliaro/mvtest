var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/', (req, res) => {
	db.exam.getAll().then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});

router.get('/:id', (req, res) => {
	db.exam.getOne(parseInt(req.params.id)).then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});

router.post('/', (req, res) => {
	db.exam.create(req.body).then(data => {
		res.status(201);
		res.send(data);
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err);
	});
});

router.put('/:id', (req, res) => {
	db.exam.edit(parseInt(req.params.id), req.body)
		.then(data => {
			res.status(204);
			res.send();
		})
		.catch(err => {
			res.status(err.code || 500);
			res.send(err.message);
		})

});

router.delete('/:id', (req, res) => {
	db.exam.delete(parseInt(req.params.id)).then(data => {
		res.status(204);
		res.send();
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});

module.exports = router;