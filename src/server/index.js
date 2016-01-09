var app = require('express')();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http)

SERVER_PORT = 3000

app.get('/', (req, res) => {
  var filePath = path.resolve('build/client/index.html')
  res.sendFile(filePath);
});

io.on('connection', function(socket) {
  console.log('a user connected')
})

http.listen(SERVER_PORT, function(){
  console.log('listening on *: ', SERVER_PORT);
});

// NOTE: must be run from porject root due to not working __dirname