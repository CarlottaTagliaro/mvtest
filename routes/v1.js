var express = require('express'),
  router = express.Router();
const piergiorgio = require('../controllers/db.js');
const db = new piergiorgio();

router.get('/tasks', db.getAllTasks);
router.get('/tasks/:id', db.getOneTask);
router.put('/tasks', db.createTask);
router.delete('/tasks/:id', db.deleteTask);

module.exports = router;