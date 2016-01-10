var app = require('express')();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http)

state = {
  status: 'NOT_STARTED',
  players: [],
  locations: [
    {
      name: 'Bogota',
      description: 'Haoeu',
      long: '12E',
      lat: '12N'
    }
  ],
  round: 0
}

// the port on which the server runs
SERVER_PORT = 3000

// respond with the index.html file when asked for /
app.get('/', (req, res) => {
  var filePath = path.resolve('build/client/index.html')
  res.sendFile(filePath);
});

// give them the client.bundle.js when they want it
app.get('/client.bundle.js', (req, res) => {
  var filePath = path.resolve('build/client/client.bundle.js')
  res.sendFile(filePath);
})

// what to do when a user connects
io.on('connection', function(socket) {
  console.log('a user connected')
  // log the disconnect too
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('message', (msg) => {
    console.log(msg)
    io.emit('INCREMENT')
  })

  socket.on('add player', (name) => {
    state.players.push({
      name: name,
      score: 0
    })

    io.emit('update players', state.players)
  })
})

// start the server on port SERVER_PORT
http.listen(SERVER_PORT, function(){
  console.log('listening on *: ', SERVER_PORT);
});

// NOTE: must be run from porject root due to not working __dirname
