var express = require('express'),
  router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/', (req, res) => {
  db.review.getAll(parseInt(req.idAssign), parseInt(req.body.sessionUser)).then(data => {
    res.status(200);
    res.json(data);
  }).catch(err => {
    res.status(err.errno || 500);
    res.send(err.message);
  });
});

router.get('/:idReview', (req, res) => {
  db.review.getOne(parseInt(req.idAssign), parseInt(req.params.idReview), parseInt(req.body.sessionUser)).then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(err.errno || 500);
    res.send(err.message);
  });
});

router.post('/', (req, res) => {
  db.review.create(parseInt(req.idAssign), req.body.payload, parseInt(req.body.sessionUser)).then(data => {
    res.status(201);
    res.send(data);
  }).catch(err => {
    res.status(err.errno || 500);
    res.send(err);
  });
});

router.put('/:idReview', (req, res) => {
  db.review.update(parseInt(req.idAssign), parseInt(req.params.idReview), req.body.payload, parseInt(req.body.sessionUser)).then(data => {
    res.status(204);
    res.send();
  }).catch(err => {
    res.status(err.errno || 500);
    res.send(err);
  });
});

router.delete('/:idReview', (req, res) => {
  db.review.delete(parseInt(req.idAssign), parseInt(req.params.idReview), parseInt(req.body.sessionUser)).then(data => {
    res.status(204);
    res.send();
  }).catch(err => {
    res.status(err.errno || 500);
    res.send(err);
  });
});

module.exports = router;