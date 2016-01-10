var app = require('express')();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http)
var _ = require('lodash')

state = {
  status: 'NOT_STARTED',
  players: [],
  locations: [
    {
      name: 'Bogota',
      description: "- Hauptstadt von Kolumbien",
      vocHelp: 'Hauptstadt - capital',
      lng: -74.075833,
      lat: 4.598056
    }
  ],
  round: 0
}

// the port on which the server runs
SERVER_PORT = 3000
ROUND_NUMBER = 10
SOLO_DISTANCE =  50000

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

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }

const startNewRound = () => {
  state.round = state.round + 1
  state.currentLocation = state.locations.random()
  state.guesses = {}
  state.writer = state.players.random().name
  state.userDescription = ''

  io.emit('start new round', {
    writer: state.writer,
    location: state.currentLocation,
    userDescription: state.userDescription
  })
}

const calculateDistence = (point1, point2) => {
  const R = 6371000; // metres
  const φ1 = point1.lat.toRadians();
  const φ2 = point2.lat.toRadians();
  const Δφ = (point1.lat-point2.lat).toRadians();
  const Δλ = (point1.lng-point2.lng).toRadians();

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;
  return d
}

const calculateRoundWinner = () => {
  if (state.players.length > 2) {
    const guessesWithDistances = _.map(state.guesses, (guess) => {
      return {
        name: guess.name,
        distance: calculateDistence(guess.latLng, {
          lat: state.currentLocation.lat,
          lng: state.currentLocation.lng
        })
      }
    })

    const roundWinner = _.reduce(guessesWithDistances, (acc, guess) => {
      console.log(guess)
      return guess.distance < acc.distance ? guess : acc
    }, {name: 'onone', distance: 123583478234578234759834257892345789234572347582345})

    state.players = _.map(state.players, (player) => {
      if (player.name === roundWinner.name) {
        return _.assign(player, {
          score: player.score + 1
        })
      } else {
        return player
      }
    })

    io.emit('and the round winner is...', roundWinner)
    io.emit('update players', state.players)
    setTimeout(startNewRound, 10000)
  } else {
    console.log(state.guesses)
    const onlyGuess = _.map(state.guesses, (val) => val)[0]
    const distance = calculateDistence(onlyGuess.latLng, {
      lat: state.currentLocation.lat,
      lng: state.currentLocation.lng
    })

    const roundWinner2 = distance < SOLO_DISTANCE ? {
      name: onlyGuess.name,
      distance: distance
    } : {
      name: 'noone',
      distance: SOLO_DISTANCE
    }

    state.players = _.map(state.players, (player) => {
      if (player.name === roundWinner2.name) {
        return _.assign(player, {
          score: player.score + 1
        })
      } else {
        return player
      }
    })

    io.emit('and the round winner is...', roundWinner2)
    io.emit('update players', state.players)
    setTimeout(startNewRound, 10000)
  }
}

// what to do when a user connects
io.on('connection', function(socket) {
  console.log('a user connected')
  // log the disconnect too
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.emit('initial data', {
    players: state.players
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
    console.log('logging state from the add player callback')
    console.log(state)

    io.emit('update players', state.players)
  })

  socket.on('start game', () => {
    console.log('started game')
    state.status = 'PLAYING'

    startNewRound()
  })

  socket.on('submit description', (description) => {
    state.userDescription = description
    io.emit('user description', description)
  })

  socket.on('submit guess', (guess) => {
    state.guesses[guess.name] = guess

    console.log(state)

    if (Object.size(state.guesses) === state.players.length -1) {
      calculateRoundWinner()
    } else {
      return false
    }
  })
})

// start the server on port SERVER_PORT
http.listen(SERVER_PORT, function(){
  console.log('listening on *: ', SERVER_PORT);
});

// NOTE: must be run from porject root due to not working __dirname
