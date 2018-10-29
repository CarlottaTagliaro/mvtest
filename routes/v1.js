var express = require('express'),
  router = express.Router();
const db = require('./db.js');

router.get('/tasks', db.getAllTasks);
router.get('/tasks/:id', db.getOneTask);
router.put('/tasks', db.createTask);

module.exports = router;