var express = require('express')
var http = require('http')

// setup vars
SERVER_PORT = 3000


var app = express()
var server = http.Server(app)

app.get('/', () => {
  res.send('<h1>Hello World</h1>')
})

server.listen(SERVER_PORT, () => {
  console.log('listening on ' + SERVER_PORT)
})