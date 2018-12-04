var express = require('express'),
  router = express.Router();
const db = require('../../controllers/db');

router.use('/auth', require('./auth.js'));
router.use('/users', require('./users.js'));
router.use('/tasks', require('./tasks.js'));

router.get('/exams', (req, res) => {
  db.exam.getAll().then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/exams/:id', (req, res) => {
  db.exam.getOne(parseInt(req.params.id)).then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    switch (err.errno) {
      case 404:
        res.status(404);
        res.send(err.message);
        break;
    }
    res.status(500);
    res.send(err.message);
  });
});

router.post('/exams', (req, res) => {

  let exam = {
    id_creator: req.body.id_creator,
    tasks: req.body.tasks
  };

  db.exam.create(exam).then(data => {
    res.status(201);
    res.send(data);
  }).catch(err => {
    res.status(500);
    res.send(err);
  });
});


router.delete('/exams/:id', (req, res) => {
  db.exam.delete(parseInt(req.params.id)).then(data => {
    res.status(204);
    res.send();
  }).catch(err => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/assignments', (req, res) => {
  db.assignment.getAll().then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/assignments/:id', (req, res) => {
  db.assignment.getOne(parseInt(req.params.id)).then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    switch (err.errno) {
      case 404:
        res.status(404);
        res.send(err.message);
        break;
    }
  });
});


module.exports = router;