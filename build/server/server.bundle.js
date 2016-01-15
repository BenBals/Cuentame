/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1)();
	var http = __webpack_require__(2).Server(app);
	var path = __webpack_require__(3);
	var io = __webpack_require__(4)(http);
	var _ = __webpack_require__(5);

	var locations = __webpack_require__(6);

	const defaultState = {
	  status: 'NOT_STARTED',
	  players: [],
	  locations: _.shuffle(locations.default),
	  round: 0
	};

	var state = _.assign({}, defaultState);

	// the port on which the server runs
	SERVER_PORT = 3000;
	// amount of rounds
	ROUND_NUMBER = 10;
	// time between rounds
	WAIT_PERIOD = 10000;

	// respond with the index.html file when asked for /
	app.get('/', (req, res) => {
	  var filePath = path.resolve('build/client/index.html');
	  res.sendFile(filePath);
	});

	app.get('/hero.png', (req, res) => {
	  var filePath = path.resolve('build/client/hero.png');
	  res.sendFile(filePath);
	});

	// give them the client.bundle.js when they want it
	app.get('/client.bundle.js', (req, res) => {
	  var filePath = path.resolve('build/client/client.bundle.js');
	  res.sendFile(filePath);
	});

	// implement the random array function
	Array.prototype.random = function () {
	  return this[Math.floor(Math.random() * this.length)];
	};

	// a function that returns the amount of elements in an object
	Object.size = function (obj) {
	  var size = 0,
	      key;
	  for (key in obj) {
	    if (obj.hasOwnProperty(key)) size++;
	  }
	  return size;
	};

	// convert any number to radians
	Number.prototype.toRadians = function () {
	  return this * Math.PI / 180;
	};

	// calculate the number of rounds to play based on the amout of players
	const calulateNumberOfRounds = playerN => {
	  switch (playerN) {
	    case 2:
	      return 6;
	    case 3:
	      return 6;
	    case 4:
	      return 8;
	    default:
	      return playerN;
	  }
	};

	// start a new round
	const startNewRound = () => {
	  // increment the round counter
	  state.round = state.round + 1;
	  // select a new location randomly
	  state.currentLocation = state.locations[state.round - 1];
	  // reset/init guesses
	  state.guesses = {};
	  // the next guy is the writer now
	  state.writer = state.players[state.round % state.players.length].name;
	  // reset/init the user description
	  state.userDescription = '';

	  // get the data to the client
	  io.emit('start new round', {
	    writer: state.writer,
	    location: state.currentLocation,
	    userDescription: state.userDescription
	  });
	};

	// func that ends the game
	const endGame = () => {
	  // get the word out to the contestants
	  io.emit('end game', state.players);
	  // set the status to ended
	  state = _.assign({}, state, {
	    status: 'ENDED'
	  });
	};

	// calculate the distance between two coordinates on the earths surface
	const calculateDistence = (point1, point2) => {
	  const R = 6371000; // metres
	  // lat of p1 and p2 in radians
	  const φ1 = point1.lat.toRadians();
	  const φ2 = point2.lat.toRadians();
	  // difference between the lat and lng in radians
	  const Δφ = (point1.lat - point2.lat).toRadians();
	  const Δλ = (point1.lng - point2.lng).toRadians();

	  // hypersine magic
	  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	  const d = R * c;
	  // the distance
	  return d;
	};

	// get a guess element form a name
	const getGuessForPlayerName = name => {
	  // get the ele using a fold (HASKELL FTW)
	  const ele = _.reduce(state.guesses, (acc, guess) => {
	    return guess.name === name ? guess : acc;
	  }, null);
	  // and return it
	  return ele;
	};

	// get calculate the score from a distance
	const getScoreForDistance = distance => {
	  return Math.round(100000 / distance);
	};

	// calulate the scores of all players
	const calculateRoundScores = () => {
	  // generate the new players array with the updated score
	  const newPlayers = _.map(state.players, player => {
	    // no points for the writer
	    if (player.name === state.writer) {
	      return player;
	    } else {
	      // get the guess of the given player
	      const playerGuess = getGuessForPlayerName(player.name);
	      // get the distance of the given player
	      const playerDistance = calculateDistence(playerGuess.latLng, {
	        lat: state.currentLocation.lat,
	        lng: state.currentLocation.lng
	      });
	      // get their new points
	      const pointsThisRound = getScoreForDistance(playerDistance);

	      // add them to the score
	      return _.assign({}, player, {
	        score: player.score + pointsThisRound
	      });
	    }
	  });

	  // save the changes
	  state = _.assign({}, state, {
	    players: newPlayers
	  });
	  // bring the shit to the client
	  io.emit('update players', state.players);
	  io.emit('round results');
	  // start a new round or end the game after the wait period
	  setTimeout(() => {
	    if (state.round >= calulateNumberOfRounds(state.players.length)) {
	      endGame();
	    } else {
	      startNewRound();
	    }
	  }, WAIT_PERIOD);
	};

	// what to do when a user connects
	io.on('connection', function (socket) {
	  console.log('a user connected');
	  // log the disconnect too
	  socket.on('disconnect', () => {
	    console.log('user disconnected');
	  });

	  // get the data needed for set up to the client
	  socket.emit('initial data', _.assign({}, state, { locations: undefined }));

	  // add the specified player
	  socket.on('add player', name => {
	    state = _.assign({}, state, {
	      players: state.players.concat([{
	        name: name,
	        score: 0
	      }])
	    });

	    // update the player data on the client side
	    io.emit('update players', state.players);
	  });

	  // start the game when the button is pressed
	  socket.on('start game', () => {
	    // set the status to playing
	    state.status = 'PLAYING';
	    // start a new round (the first one, but it makes on difference)
	    startNewRound();
	  });

	  // get the description form the writer
	  socket.on('submit description', description => {
	    // update the state
	    state = _.assign({}, state, { userDescription: description });
	    // the description to the clients
	    io.emit('user description', description);
	  });

	  // get the guesses from the clients
	  socket.on('submit guess', guess => {
	    // add the guess to the obj
	    state.guesses[guess.name] = guess;

	    // if everyone answered do the evaluation if not wait some more
	    if (Object.size(state.guesses) >= state.players.length - 1) {
	      calculateRoundScores();
	    } else {
	      return false;
	    }
	  });

	  // reset when the client orders it
	  socket.on('reset', () => {
	    console.log('=====================');
	    console.log('=        reset      =');
	    console.log('=====================');
	    // reset the state
	    state = _.assign({}, defaultState, { players: [] });
	    // tell all clients to reload
	    io.emit('reset');
	    // and redo the setup
	    io.emit('initial data', _.assign({}, state, { locations: undefined }));
	  });
	});

	// start the server on port SERVER_PORT or the dynamic port on heroku
	http.listen(process.env.PORT || SERVER_PORT, function () {
	  console.log('listening on *: ', process.env.PORT || SERVER_PORT);
	});

	// NOTE: must be run from porject root due to not working __dirname

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports) {

	const locations = [{
	  name: 'Bogotá',
	  description: "- Hauptstadt von Kolumbien",
	  vocHelp: 'Hauptstadt - capital',
	  lng: -74.075833,
	  lat: 4.598056
	}, {
	  name: 'Medellín',
	  description: "- Hauptstadt des Departamento Atlántico in Kolumbien \n- zweitgrößte Stadt Kolumbiens \n- Geburtsort von Juanes",
	  vocHelp: 'die Geburt - el nacimiento',
	  lng: -75.564574,
	  lat: 6.253041
	}, {
	  name: 'Barranquilla',
	  description: "- Hauptstadt des Departamento Atlántico in Kolumbien \n- viertgrößte Stadt Kolumbiens \n- Geburtsort von Shakira",
	  vocHelp: 'die Geburt - el nacimiento',
	  lng: -74.797044,
	  lat: 10.96421
	}, {
	  name: 'Buenaventura',
	  description: "- Lage: auf Insel Cascajal an der Pazifikküste am Fuß der Anden",
	  vocHelp: 'die Pazifikküste - la costa del Océano Pacífico \nam Fuß - al pie',
	  lng: -77.019721,
	  lat: 3.883047
	}, {
	  name: 'Cartagena',
	  description: "- liegt südwestlich von Barranquilla \n- Stadt an der Karibikküste Kolumbiens",
	  vocHelp: '',
	  lng: -75.514167,
	  lat: 10.399444
	}, {
	  name: 'Cúcuta',
	  description: "- sechstgrößte Stadt Kolumbiens \n- liegt im Nordosten Kolumbiens an der Grenze zu Venezuela \n- Hauptstadt der Provinz Norte de Santander",
	  vocHelp: 'die Grenze - la frontera',
	  lng: -72.49669,
	  lat: 7.889097
	}, {
	  name: 'Cali',
	  description: "- liegt im Westen Kolumbiens \n- Hauptstadt der Region Valle de Cauca \n- liegt am Río Cali",
	  vocHelp: 'am Ufer der/des...liegen - estar a orillas de...',
	  lng: -76.528333,
	  lat: 3.457222
	}, {
	  name: 'Ibagué',
	  description: "- westlich von Bogotá \n	- Hauptstadt der Region Tolima",
	  vocHelp: '',
	  lng: -75.233333,
	  lat: 4.45
	}, {
	  name: 'Santa Marta',
	  description: "- Stadt im Norden Kolumbiens \n- liegt an der Karibikküste",
	  vocHelp: '',
	  lng: -74.201667,
	  lat: 11.236111
	}, {
	  name: 'Pico Cristóbal Colón',
	  description: "- zusammen mit Pico Simón Bolívar höchster Berg Kolumbiens \n- liegt im Gebirge Sierra Nevada de Santa Marta im Norden Kolumbiens",
	  vocHelp: '',
	  lng: -73.6865,
	  lat: 10.838619
	}, {
	  name: 'Pico Simón Bolívar',
	  description: "- zusammen mit Pico Cristóbal Colón höchster Berg Kolumbiens \n- liegt im Gebirge Sierra Nevada de Santa Marta im Norden Kolumbiens",
	  vocHelp: '',
	  lng: -73.713539,
	  lat: 10.840639
	}, {
	  name: 'Ciudad Perdida',
	  description: "- liegt im Norden Kolumbiens in der Sierra Nevada de Santa Marta \n- neben Machu Picchu eine der größten Städte aus der Zeit vor Christoph Kolumbus",
	  vocHelp: '',
	  lng: -73.925192,
	  lat: 11.037997
	}, {
	  name: 'Leticia',
	  description: "- südlichste Stadt Kolumbiens",
	  vocHelp: '',
	  lng: -69.940278,
	  lat: -4.208333
	}, {
	  name: 'Nevado del Ruiz',
	  description: "- Vulkan in den Anden \n- liegt westlich von Bogotá",
	  vocHelp: 'der Vulkan - el volcán',
	  lng: -75.316667,
	  lat: 4.883333
	}, {
	  name: 'Galeras',
	  description: "- Vulkan in den Anden \n- liegt im Südwesten von Kolumbien",
	  vocHelp: '',
	  lng: -77.353333,
	  lat: 1.221944
	}, {
	  name: 'Florencia',
	  description: "- Hauptstadt der Provinz Caquetá \n- liegt im Süden Kolumbiens, am östlichen Fuß der Anden (Kordillieren)",
	  vocHelp: '',
	  lng: -75.612778,
	  lat: 1.613889
	}, {
	  name: 'Malpelo',
	  description: "- Insel im Pazifik \n- westlichster Ort Kolumbiens",
	  vocHelp: '',
	  lng: -81.6075,
	  lat: 4.002778
	}, {
	  name: 'Lago de Tota',
	  description: "- größter SÜSSWASSERsee Kolumbiens \n- liegt ungefähr in halber Verlängerung Cali -> Bogotá",
	  vocHelp: 'das Süßwasser - la agua dulce \nungefähr - más o menos \ndie Verlängerung - el alargamiento',
	  lng: -72.92,
	  lat: 5.54
	}, {
	  name: 'Acevedo',
	  description: "- Quelle des Rio Magdalena (dieser mündet in Barranquilla) \n- liegt im Süden der Anden, südwestlich von Popayán",
	  vocHelp: 'die Quelle - la fuente \nmünden in... - desembocar en...',
	  lng: -75.612778,
	  lat: 1.613889
	}, {
	  name: 'Nevado del Huila',
	  description: "- Vulkan in den Anden \n- liegt in der Zentral-Kordillerie in den Anden \n- befindet sich südlicher als Cali",
	  vocHelp: 'die Zentral-Kordillerie - la cordillera central',
	  lng: -76.033333,
	  lat: 2.933333
	}, {
	  name: 'Bucaramanga',
	  description: "- Hauptstadt des Departamento Santander in Kolumbien \n- liegt nordöstlich von Bogotá \n- besitzt eine der renommiertesten technischen Universitäten in der Region",
	  vocHelp: 'renommiert - prestigioso/-a \n technisch - técnico/-a',
	  lng: -73.122742,
	  lat: 7.119349
	}, {
	  name: 'Pereira',
	  description: "- Stadt, liegt am westlichen Fuß der Zentral-Kordilleren \n- etwa Mittelpunkt des „Goldenen Dreiecks“ Bogotá-Medellín-Cali",
	  vocHelp: 'das Gold - el oro \ndas Dreieck - el triángulo',
	  lng: -75.695833,
	  lat: 4.813056
	}, {
	  name: 'Pasto',
	  description: "- Hauptstadt des Departamentos Nariño im Südwesten Kolumbiens \n- liegt am Fuß des Vulkans Galeras",
	  vocHelp: '',
	  lng: -77.280833,
	  lat: 1.213333
	}, {
	  name: 'Manizales',
	  description: "- Hauptstadt des Departamento Caldas \n- liegt im Hauptkaffeeanbaugebiet Kolumbiens \n- befindet sich nordöstlich von Pereira",
	  vocHelp: 'Haupt-... - principal \ndas Anbaugebiet - el terreno de cultivo',
	  lng: -75.517222,
	  lat: 5.068889
	}, {
	  name: 'Turbo',
	  description: "- Stadt und Gemeinde im Norden Kolumbiens \n- liegt am Golf von Urabá am Karibischen Meer \n- Hafenstadt und Grenzstadt nach Panamá",
	  vocHelp: 'die Gemeinde - el municipio \nder Golf - el golfo \ndie Hafenstadt - la ciudad portuaria',
	  lng: -76.728056,
	  lat: 8.0925
	}];

	module.exports.default = locations;

/***/ }
/******/ ]);