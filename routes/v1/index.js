var express = require('express'),
  router = express.Router();
const db = require('../../controllers/db.js');

router.use('/auth', require('./auth.js'));

router.get('/tasks', db.getAllTasks, (req, res) => {
  res.status(200);
  res.send(res.locals.data.rows);
});

router.get('/tasks/:id', db.getOneTask);
router.put('/tasks', db.createTask);
router.post('/tasks/:id', db.editTask);
router.delete('/tasks/:id', db.deleteTask);

module.exports = router;