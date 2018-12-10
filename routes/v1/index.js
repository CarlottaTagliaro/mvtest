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

module.exports = router;