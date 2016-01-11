var app = require('express')();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http)
var _ = require('lodash')

const defaultState = {
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

var state = _.assign({}, defaultState)

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
  state.writer = state.players[state.round % state.players.length].name
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

const getPlayerElementForName = (name) => {

  const ele = _.reduce(state.players, (acc, player) => {
    return player.name === name ? player : acc
  }, null)
  console.log('the player element for the name ' + name + 'is:')
  console.log(ele)
  return ele
}

const getScoreForDistance = (distance) => {
  const res = Math.floor(100000 / distance)
  console.log('the score for the distance ' + distance + ' is ' + res)
  return res
} 

const calculateRoundScores = () => {

  const guessesWithDistances = _.map(state.guesses, (guess) => {
    return {
      name: guess.name,
      distance: calculateDistence(guess.latLng, {
        lat: state.currentLocation.lat,
        lng: state.currentLocation.lng
      })
    }
  })

  const newPlayers = [].concat(

    _.map(guessesWithDistances, (guess) => {
      return _.assign({}, getPlayerElementForName(guess.name), {
        score: getPlayerElementForName(guess.name).score + getScoreForDistance(guess.distance)
      })
    }),

    getPlayerElementForName(state.writer)

  )

  console.log('new player arr: ')

  console.log(newPlayers)

  state = _.assign({}, state, {
    players: newPlayers
  })

  io.emit('update players', state.players)
  io.emit('round results')

  setTimeout(startNewRound, 10000)
}

// what to do when a user connects
io.on('connection', function(socket) {
  console.log('a user connected')
  // log the disconnect too
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.emit('initial data', _.assign({}, state, {locations: undefined}))

  socket.on('message', (msg) => {
    console.log(msg)
    io.emit('INCREMENT')
  })

  socket.on('add player', (name) => {
    state = _.assign({}, state, {
      players: state.players.concat([
      {
        name: name,
        score: 0
      }
      ])
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
    console.log(Object.size(state.guesses))
    console.log(state.players.length -1)

    if (Object.size(state.guesses) >= state.players.length -1) {
      console.log('the round is over')
      calculateRoundScores()
    } else {
      return false
    }
  })

  socket.on('reset', () => {
    console.log('=====================')
    console.log('reset')
    console.log('=====================')
    console.log(defaultState)
    state = _.assign({}, defaultState, {players: []})
    io.emit('reset')
    console.log(state)
    io.emit('initial data', _.assign({}, state, {locations: undefined}))

    console.log(state)
  })
})

// start the server on port SERVER_PORT
http.listen(process.env.PORT || SERVER_PORT, function(){
  console.log('listening on *: ', process.env.PORT || SERVER_PORT);
});

// NOTE: must be run from porject root due to not working __dirname
