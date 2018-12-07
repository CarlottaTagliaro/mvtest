var express = require('express'),
  router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/:assignId/reviews', (req, res) => {
  db.review.getAll(parseInt(req.params.assignId)).then(data => {
    res.status(200);
    res.json(data);
  }).catch(err => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/:assignId/reviews/:id', (req, res) => {
  db.review.getOne(parseInt(req.params.assignId), parseInt(req.params.id)).then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(err.errno || 500);
    res.send(err.message);
  });
});

router.post('/:assignId/reviews', (req, res) => {
  req.body.id_assign = parseInt(req.params.assignId);

  db.review.create(req.body).then(data => {
    res.status(201);
    res.send(data);
  }).catch(err => {
    res.status(500);
    res.send(err);
  });
});

router.put('/:assignId/reviews/:id ', (req, res) => {
  req.body.id_assign = parseInt(req.params.assignId);

  db.review.update(parseInt(req.params.id), req.body).then(data => {
    res.status(204);
    res.send();
  }).catch(err => {
    res.status(500);
    res.send(err);
  });
});

router.delete('/:assignId/reviews/:id', (req, res) => {
  db.review.delete(parseInt(req.params.assignId), parseInt(req.params.id)).then(data => {
    res.status(204);
    res.send();
  }).catch(err => {
    res.status(500);
    res.send(err);
  });
});

module.exports = router;