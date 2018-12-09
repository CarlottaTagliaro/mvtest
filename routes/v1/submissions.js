var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/:assignId/submissions', (req, res) => {
	db.submission.getAll(parseInt(req.params.assignId)).then((data) => {
		res.status(200);
		res.json(data);
	}).catch((err) => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});


router.post('/:assignId/submissions', (req, res) => {
	db.submission.create(parseInt(req.params.assignId), req.body).then(data => {
		res.status(201);
		res.send(data);
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err);
	});
});

router.delete('/:assignId/submissions', (req, res) => {
	db.submission.delete(parseInt(req.params.assignId), parseInt(req.body.id_user)).then(data => {
		res.status(204);
		res.send();
	}).catch(err => {
		res.status(err.code || 500);
		res.send(err.message);
	});
});


module.exports = router;