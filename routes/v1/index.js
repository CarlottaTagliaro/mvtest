var express = require('express'),
  router = express.Router();
const db = require('../../controllers/db');

router.use('/auth', require('./auth.js'));
router.use('/users', require('./users.js'));
router.use('/tasks', require('./tasks.js'));
router.use('/exams', require('./exams.js'));
router.use('/classes', require('./class.js'));
router.use('/assignments', require('./assignments.js'));

router.use('/assignments/:idAssign', (req, res, next) => {
  req.idAssign = req.params.idAssign;
  next();
})

router.use('/assignments/:idAssign/submissions', require('./submissions.js'));
router.use('/assignments/:idAssign/submissions/reviews', require('./reviews.js'));

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
    res.status(500);
    res.send(err.message);
  });
});


module.exports = router;