const express = require('express')
const app = express()

// user creation
app.post('/user', function (req, res) {
  res.send('POST request to homepage')
})

// user updating
app.put('/user/:userId', function (req, res) {
  res.send('PUT request to homepage')
})

// user deletion
app.delete('/user/:userId', function (req, res) {
  res.send('DELETE request to homepage')
})

// user retrivial
app.get('/user', function (req, res) {
  res.send('GET request to homepage')
})

app.listen(3000)
