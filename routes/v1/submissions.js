var express = require('express')

var router = express.Router()

const db = require('../../controllers/db/index.js')

router.get('/', (req, res) => {
  db.submission.getAll(parseInt(req.idAssign)).then((data) => {
    res.status(200)
    res.json(data)
  }).catch((err) => {
    res.status(err.errno || 500)
    res.send(err.message)
  })
})

router.post('/', (req, res) => {
  db.submission.create(parseInt(req.idAssign), req.body).then(data => {
    res.status(201)
    res.send(data)
  }).catch(err => {
    res.status(err.errno || 500)
    res.send(err)
  })
})

router.delete('/', (req, res) => {
  db.submission.delete(parseInt(req.idAssign), parseInt(req.body.id_user)).then(data => {
    res.status(204)
    res.send()
  }).catch(err => {
    res.status(err.errno || 500)
    res.send(err.message)
  })
})

module.exports = router
