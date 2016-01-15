var app = require('express')();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http)
var _ = require('lodash')

var locations = require('./locations.js')

const defaultState = {
  status: 'NOT_STARTED',
  players: [],
  locations: _.shuffle(locations.default),
  round: 0
}

var state = _.assign({}, defaultState)

// the port on which the server runs
SERVER_PORT = 3000
// amount of rounds
ROUND_NUMBER = 10
// time between rounds
WAIT_PERIOD = 5000

// respond with the index.html file when asked for /
app.get('/', (req, res) => {
  var filePath = path.resolve('build/client/index.html')
  res.sendFile(filePath);
});

app.get('/hero.png', (req, res) => {
    var filePath = path.resolve('build/client/hero.png')
    res.sendFile(filePath)
})

// give them the client.bundle.js when they want it
app.get('/client.bundle.js', (req, res) => {
  var filePath = path.resolve('build/client/client.bundle.js')
  res.sendFile(filePath);
})

// implement the random array function
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

// a function that returns the amount of elements in an object
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

// convert any number to radians
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }

// calculate the number of rounds to play based on the amout of players
const calulateNumberOfRounds = (playerN) => {
  switch (playerN) {
    case 2:
      return 6
    case 3:
      return 6
    case 4:
      return 8
    default:
      return playerN
  }
}

// start a new round
const startNewRound = () => {
  // increment the round counter
  state.round = state.round + 1
  // select a new location randomly
    state.currentLocation = state.locations[(state.round - 1)]
  // reset/init guesses
  state.guesses = {}
  // the next guy is the writer now
  state.writer = state.players[state.round % state.players.length].name
  // reset/init the user description
  state.userDescription = ''

  // get the data to the client
  io.emit('start new round', {
    writer: state.writer,
    location: state.currentLocation,
    userDescription: state.userDescription
  })
}

// func that ends the game
const endGame = () => {
  // get the word out to the contestants
  io.emit('end game', state.players)
  // set the status to ended
  state = _.assign({}, state, {
    status: 'ENDED'
  })
}


// calculate the distance between two coordinates on the earths surface
const calculateDistence = (point1, point2) => {
  const R = 6371000; // metres
  // lat of p1 and p2 in radians
  const φ1 = point1.lat.toRadians();
  const φ2 = point2.lat.toRadians();
  // difference between the lat and lng in radians
  const Δφ = (point1.lat-point2.lat).toRadians();
  const Δλ = (point1.lng-point2.lng).toRadians();

  // hypersine magic
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;
  // the distance
  return d
}

// get a guess element form a name
const getGuessForPlayerName = (name) => {
  // get the ele using a fold (HASKELL FTW)
  const ele = _.reduce(state.guesses, (acc, guess) => {
    return guess.name === name ? guess : acc
  }, null)
  // and return it
  return ele
}

// get calculate the score from a distance
const getScoreForDistance = (distance) => {
  return Math.round(100000 / distance)
}

// calulate the scores of all players
const calculateRoundScores = () => {
  // generate the new players array with the updated score
  const newPlayers = _.map(state.players, (player) => {
    // no points for the writer
    if (player.name === state.writer) {
      return player
    } else {
      // get the guess of the given player
      const playerGuess = getGuessForPlayerName(player.name)
      // get the distance of the given player
      const playerDistance = calculateDistence(playerGuess.latLng, {
        lat: state.currentLocation.lat,
        lng: state.currentLocation.lng
      })
      // get their new points
      const pointsThisRound = getScoreForDistance(playerDistance)

      // add them to the score
      return _.assign({}, player, {
        score: player.score + pointsThisRound
      })
    }
  })

  // save the changes
  state = _.assign({}, state, {
    players: newPlayers
  })
  // bring the shit to the client
  io.emit('update players', state.players)
  io.emit('round results')
  // start a new round or end the game after the wait period
  setTimeout(() => {
    if (state.round >= calulateNumberOfRounds(state.players.length)) {
      endGame()
    } else {
      startNewRound()
    }
  }, WAIT_PERIOD)
}

// what to do when a user connects
io.on('connection', function(socket) {
  console.log('a user connected')
  // log the disconnect too
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // get the data needed for set up to the client
  socket.emit('initial data', _.assign({}, state, {locations: undefined}))

  // add the specified player
  socket.on('add player', (name) => {
    state = _.assign({}, state, {
      players: state.players.concat([
      {
        name: name,
        score: 0
      }
      ])
    })

    // update the player data on the client side
    io.emit('update players', state.players)
  })

  // start the game when the button is pressed
  socket.on('start game', () => {
    // set the status to playing
    state.status = 'PLAYING'
    // start a new round (the first one, but it makes on difference)
    startNewRound()
  })

  // get the description form the writer
  socket.on('submit description', (description) => {
    // update the state
    state = _.assign({}, state, {userDescription: description})
    // the description to the clients
    io.emit('user description', description)
  })

  // get the guesses from the clients
  socket.on('submit guess', (guess) => {
    // add the guess to the obj
    state.guesses[guess.name] = guess

    // if everyone answered do the evaluation if not wait some more
    if (Object.size(state.guesses) >= state.players.length -1) {
      calculateRoundScores()
    } else {
      return false
    }
  })

  // reset when the client orders it
  socket.on('reset', () => {
    console.log('=====================')
    console.log('=        reset      =')
    console.log('=====================')
    // reset the state
    state = _.assign({}, defaultState, {players: []})
    // tell all clients to reload
    io.emit('reset')
    // and redo the setup
    io.emit('initial data', _.assign({}, state, {locations: undefined}))
  })
})

// start the server on port SERVER_PORT or the dynamic port on heroku
http.listen(process.env.PORT || SERVER_PORT, function(){
  console.log('listening on *: ', process.env.PORT || SERVER_PORT);
});

// NOTE: must be run from porject root due to not working __dirname
