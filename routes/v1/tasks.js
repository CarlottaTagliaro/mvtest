var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db');

router.get('/', (req, res) => {
	db.task.getAll().then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.get('/:id', (req, res) => {
	db.task.getOne(parseInt(req.params.id)).then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		console.error(err, err.errno);
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.put('/:id', (req, res) => {
	db.task.update(parseInt(req.params.id), req.body).then((data) => {
		res.status(204);
		res.send();
	}).catch((err) => {
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.delete('/:id', (req, res) => {
	db.task.delete(parseInt(req.params.id)).then((data) => {
		res.status(204);
		res.send();
	}).catch((err) => {
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.post('/', (req, res) => {
	db.task.create(req.body).then(data => {
		res.status(201);
		res.send(data);
	}).catch(err => {
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.delete('/:id', (req, res) => {
	db.task.delete(parseInt(req.params.id)).then(data => {
		res.status(204);
		res.send();
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});

module.exports = router;