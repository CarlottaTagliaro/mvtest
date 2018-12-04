var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/', (req, res) => {
	db.task.getAll().then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(500);
		res.send(err.message);
	});
});

router.get('/:id', (req, res) => {
	db.task.getOne(parseInt(req.params.id)).then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.errno || 500);
		res.send(err.message);
	});
});

router.post('/', (req, res) => {

	let text = {
		question: req.body.question
	};
	let task = {
		points: req.body.points,
		id_type: 1
	}

	if (req.body.answer1 || req.body.answer2 || req.body.answer3 || req.body.answer4) {
		text.choices = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4];

		if (req.body.multipleChoice == 'on')
			task.id_type = 3;
		else
			task.id_type = 2;
	}
	task.text = text

	console.log(task)

	db.task.create(task).then(data => {
		res.status(201);
		res.send(data);
	}).catch(err => {
		res.status(500);
		res.send(err);
	});
});

router.delete('/:id', (req, res) => {
	db.task.delete(parseInt(req.params.id)).then(data => {
		res.status(204);
		res.send();
	}).catch(err => {
		res.status(500);
		res.send(err.message);
	});
});

module.exports = router;