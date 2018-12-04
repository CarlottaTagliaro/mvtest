var express = require('express'),
  router = express.Router();

const db = require('../../controllers/db/index.js');

router.get('/', (req, res) => {
  db.user.getAll().then(data => {
    res.status(200);
    res.json(data);
  }).catch(err => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/:id', (req, res) => {
  db.user.getOne(parseInt(req.params.id)).then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(err.errno || 500);
    res.send(err.message);
  });
});

router.post('/', (req, res) => {
  db.user.create(req.body).then(data => {
    res.status(201);
    res.send(data);
  }).catch(err => {
    res.status(500);
    res.send(err);
  });
});

module.exports = router;