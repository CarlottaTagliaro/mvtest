var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/:id/submissions', (req, res) => {
	db.submission.getAll(parseInt(req.params.id)).then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});


router.post('/:id/submissions', (req, res) => {
	db.submission.create(parseInt(req.params.id),req.body).then(data => {
		res.status(201);
		res.send(data);
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err);
	});
});

router.delete('/:id/submissions', (req, res) => {
	db.exam.delete(parseInt(req.params.id),parseInt(req.body.id_user)).then(data => {
		res.status(204);
		res.send();
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});


module.exports = router;