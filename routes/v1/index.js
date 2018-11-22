var express = require('express'),
  router = express.Router();
const db = require('../../controllers/db');

router.use('/auth', require('./auth.js'));

router.get('/tasks', (req, res) => {
  db.task.getAll().then((data) => {
    res.status(200);
    res.json(data);
  }).catch((err) => {
    res.status(500);
    res.send(err.message);
  });
});

router.get('/tasks/:id', (req, res) => {
  db.task.getOne(req.params.id).then((data) => {
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

router.post('/tasks', (req, res) => {

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

//router.put('/tasks/:id', db.editTask);
//router.delete('/tasks/:id', db.deleteTask);

module.exports = router;