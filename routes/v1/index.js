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

router.get('/tasks/:id', (req, res) => {
  db.getOneTask(req.params.id).then((data) => {
    res.status(200);
    res.send(data);
  }).catch((err) => {
    switch(err.errno){
      case 404: 
        res.status(404);
        res.send(err.message);
        break;
    }
    res.status(500);
    res.send(err);
  });
});

router.post('/tasks', db.createTask);
router.put('/tasks/:id', db.editTask);
router.delete('/tasks/:id', db.deleteTask);

module.exports = router;