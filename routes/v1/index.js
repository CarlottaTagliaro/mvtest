var express = require('express'),
  router = express.Router();
const db = require('../../controllers/db.js');

router.use('/auth', require('./auth.js'));

router.get('/tasks', (req, res) => {
  db.getAllTasks().then((data) => {
    res.status(200);
    res.send(data);
  }).catch((err) => {
    res.status(500);
    res.send(err);
  });
});

router.get('/tasks/:id', db.getOneTask);
router.post('/tasks', db.createTask);
router.put('/tasks/:id', db.editTask);
router.delete('/tasks/:id', db.deleteTask);

module.exports = router;