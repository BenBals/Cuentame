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
	WAIT_PERIOD = 5000;

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

	const reset = () => {
	  console.log('=====================');
	  console.log('=        reset      =');
	  console.log('=====================');
	  // reset the state
	  state = _.assign({}, defaultState, { players: [] });
	  // tell all clients to reload
	  io.emit('reset');
	  // and redo the setup
	  io.emit('initial data', _.assign({}, state, { locations: undefined }));
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

	  socket.on('remove player', playerName => {
	    state = _.assign({}, state, {
	      players: _.filter(state.players, player => {
	        return player.name !== playerName;
	      })
	    });

	    if (state.status === 'PLAYING') {
	      if (state.players.length >= 2) {
	        io.emit('update players', state.players);
	        startNewRound();
	      } else {
	        reset();
	      }
	    } else {
	      io.emit('update players', state.players);
	    }
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
	    reset();
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
	  vocHelp: '',
	  lng: -74.075833,
	  lat: 4.598056
	}, {
	  name: 'Medellín',
	  description: "- Hauptstadt des Departamento Antioquia in Kolumbien \n- zweitgrößte Stadt Kolumbiens \n- Geburtsort von Juanes",
	  vocHelp: '- die Geburt - el nacimiento \n - zweitgrößte - segunda más grande',
	  lng: -75.564574,
	  lat: 6.253041
	}, {
	  name: 'Barranquilla',
	  description: "- Hauptstadt des Departamento Atlántico in Kolumbien \n- viertgrößte Stadt Kolumbiens \n- Geburtsort von Shakira",
	  vocHelp: '- die Geburt - el nacimiento \n - viertgrößte - cuarta más grande',
	  lng: -74.797044,
	  lat: 10.96421
	}, {
	  name: 'Buenaventura',
	  description: "- Lage: an der Pazifikküste \n - am Fuß der Anden",
	  vocHelp: 'die Pazifikküste - la costa del Océano Pacífico \n - am Fuß - al pie',
	  lng: -77.019721,
	  lat: 3.883047
	}, {
	  name: 'Cartagena',
	  description: "- liegt südwestlich von Barranquilla \n - Stadt an der Karibikküste Kolumbiens",
	  vocHelp: '',
	  lng: -75.514167,
	  lat: 10.399444
	}, {
	  name: 'Cúcuta',
	  description: "- sechstgrößte Stadt Kolumbiens \n- liegt im Nordosten Kolumbiens an der Grenze zu Venezuela \n- Hauptstadt der Provinz Norte de Santander",
	  vocHelp: 'die Grenze - la frontera \n - sechstgrößte - sexta más grande',
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
	  vocHelp: '- die Küste - la costa',
	  lng: -74.201667,
	  lat: 11.236111
	}, {
	  name: 'Pico Cristóbal Colón',
	  description: "- zusammen mit Pico Simón Bolívar höchster Berg Kolumbiens \n- liegt in der Sierra Nevada de Santa Marta im Norden Kolumbiens",
	  vocHelp: '- das Gebirge - la sierra',
	  lng: -73.6865,
	  lat: 10.838619
	}, {
	  name: 'Pico Simón Bolívar',
	  description: "- zusammen mit Pico Cristóbal Colón höchster Berg Kolumbiens \n- liegt in der Sierra Nevada de Santa Marta im Norden Kolumbiens",
	  vocHelp: '- das Gebirge - la sierra',
	  lng: -73.713539,
	  lat: 10.840639
	}, {
	  name: 'Ciudad Perdida',
	  description: "- liegt im Norden Kolumbiens in der Sierra Nevada de Santa Marta \n- neben Machu Picchu eine der größten Städte aus der Zeit vor Christoph Kolumbus",
	  vocHelp: '- eine der größten... - una de las mayores...',
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
	  vocHelp: '- am Fuß - al pie',
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
	  description: "- größter Süßwassersee Kolumbiens \n- liegt ungefähr in halber Verlängerung Cali -> Bogotá",
	  vocHelp: '- das Süßwasser - la agua dulce \n - ungefähr - más o menos \n - die Verlängerung - el alargamiento',
	  lng: -72.92,
	  lat: 5.54
	}, {
	  name: 'Acevedo',
	  description: "- Quelle des Rio Magdalena (dieser mündet in Barranquilla) \n- liegt im Süden der Anden, südwestlich von Popayán",
	  vocHelp: '- die Quelle - la fuente \n - münden in... - desembocar en...',
	  lng: -75.612778,
	  lat: 1.613889
	}, {
	  name: 'Nevado del Huila',
	  description: "- Vulkan in den Anden \n- liegt in der Zentral-Kordillerie in den Anden \n- befindet sich südlicher als Cali",
	  vocHelp: '- die Zentral-Kordillerie - la cordillera central',
	  lng: -76.033333,
	  lat: 2.933333
	}, {
	  name: 'Bucaramanga',
	  description: "- Hauptstadt des Departamento Santander in Kolumbien \n- liegt nordöstlich von Bogotá \n- besitzt eine der renommiertesten technischen Universitäten in der Region",
	  vocHelp: '- renommiert - prestigioso/-a \n - technisch - técnico/-a',
	  lng: -73.122742,
	  lat: 7.119349
	}, {
	  name: 'Pereira',
	  description: "- Stadt, liegt am westlichen Fuß der Zentral-Kordilleren \n- etwa Mittelpunkt des „Goldenen Dreiecks“ Bogotá-Medellín-Cali",
	  vocHelp: '- das Gold - el oro \n - das Dreieck - el triángulo \n - am Fuß - al pie',
	  lng: -75.695833,
	  lat: 4.813056
	}, {
	  name: 'Pasto',
	  description: "- Hauptstadt des Departamentos Nariño im Südwesten Kolumbiens \n- liegt am Fuß des Vulkans Galeras",
	  vocHelp: '- am Fuß - al pie',
	  lng: -77.280833,
	  lat: 1.213333
	}, {
	  name: 'Manizales',
	  description: "- Hauptstadt des Departamento Caldas \n- liegt im Hauptkaffeeanbaugebiet Kolumbiens \n- befindet sich nordöstlich von Pereira",
	  vocHelp: 'Haupt-... - principal \n - das Anbaugebiet - el terreno de cultivo',
	  lng: -75.517222,
	  lat: 5.068889
	}, {
	  name: 'Turbo',
	  description: "- Stadt und Gemeinde im Norden Kolumbiens \n - liegt am Golf von Urabá am Karibischen Meer \n - Hafenstadt und Grenzstadt nach Panamá",
	  vocHelp: 'die Gemeinde - el municipio \n - der Golf - el golfo \n - die Hafenstadt - la ciudad portuaria',
	  lng: -76.728056,
	  lat: 8.0925
	}, {
	  name: 'Riohacha',
	  description: "- Hauptstadt des nördlichsten Departamento (La Guijira) Kolumbiens  \n- liegt an der kolumbianischen Karibikküste",
	  vocHelp: '',
	  lng: -72.906944,
	  lat: 11.544167
	}, {
	  name: 'Sincelejo',
	  description: "- Hauptstadt des Departamentos Sucre \n- liegt südlich von Cartagena",
	  vocHelp: '',
	  lng: -75.390557,
	  lat: 9.304577
	}, {
	  name: 'Montería',
	  description: "- Hauptstadt des Departamentos Córdoba \n- liegt südwestlich von Sincelejo \n- liegt am Río Sinú",
	  vocHelp: 'die Gemeinde - el municipio \n - der Golf - el golfo \n - die Hafenstadt - la ciudad portuaria',
	  lng: -75.878535,
	  lat: 8.750983
	}, {
	  name: 'Valledupar',
	  description: "- Hauptstadt des Departamento del Cesar im Norden Kolumbiens \n- auch interrnational als „Welt-Hauptstadt des Vallenato“ bekannt",
	  vocHelp: '',
	  lng: -73.243633,
	  lat: 10.474245
	}, {
	  name: 'Arauca',
	  description: "- Hauptstadt des gleichnamigen Departamento in Kolumbien \n- liegt am gleichnamigen Fluss \n- die Internationale Brücke José Antonio Páez führt über diesen Fluss nach Venezuela",
	  vocHelp: '- gleichnamig - del mismo nombre \n- führen - llevar',
	  lng: -70.710457,
	  lat: 7.076172
	}, {
	  name: 'Quibdó',
	  description: "- Hauptstadt und Regierungssitz des Departamento del Chocó in Nordwestkolumbien \n- liegt am Río Atrato",
	  vocHelp: "",
	  lng: -76.649812,
	  lat: 5.695633
	}, {
	  name: 'Armenia',
	  description: "- Hauptstadt des Departamento Quindío \n- liegt südlich von Pereira und westlich von Ibagué",
	  vocHelp: '',
	  lng: -75.680833,
	  lat: 4.533889
	}, {
	  name: 'Tunja',
	  description: "- Hauptstadt des Departamento Boyacá \n- liegt am Westrand der Ostkordillere der Anden \n- liegt nordöstlich von Bogotá und etwa südwestlich von Bucaramanga",
	  vocHelp: '-	der Rand - la periferia',
	  lng: -73.357557,
	  lat: 5.544642
	}, {
	  name: 'Yopal',
	  description: "- Hauptstadt des Departamento Casanare \n- liegt etwa nordöstlich von Bogotá",
	  vocHelp: '',
	  lng: -72.400523,
	  lat: 5.348903
	}, {
	  name: 'Puerto Carreño',
	  description: "- Hauptstadt des Departamento Vichada im Osten Kolumbiens \n- liegt etwa am Zusammenfluss der Flüsse Orinoco und Meta \n- liegt an der Grenze zu Venezuela",
	  vocHelp: '- der Zusammenfluss - la confluencia \n - die Grenze - la frontera',
	  lng: -67.488462,
	  lat: 6.184766
	}, {
	  name: 'Popayán',
	  description: "- Hauptstadt des Departamento de Cauca in Südwestkolumbien \n- befindet sich im Valle de Pubenza zwischen der West- und Zentralkordillere der Anden",
	  vocHelp: '',
	  lng: -76.614739,
	  lat: 2.444814
	}, {
	  name: 'Neiva',
	  description: "- Hauptstadt des Departamento Huila in Südwestkolumbien \n- liegt etwa zwischen den Städten Ibagué im Norden und Florencia im Süden",
	  vocHelp: '',
	  lng: -75.2809,
	  lat: 2.934484
	}, {
	  name: 'Villavicencio',
	  description: "- Hauptstadt des Departamento del Meta in Zentralkolumbien \n- liegt südöstlich von Bogotá",
	  vocHelp: '',
	  lng: -73.63769,
	  lat: 4.151382
	}, {
	  name: 'Inírida',
	  description: "- Hauptstadt des Departamento Guainía in Ostkolumbien \n- liegt am Fluss Orinoco",
	  vocHelp: '- am Ufer der/des...liegen - estar a orillas de...',
	  lng: -67.923889,
	  lat: 3.865278
	}, {
	  name: 'Mocoa',
	  description: "- Hauptstadt des Departamento Putumayo in Südkolumbien \n- liegt südlich von Popayán und etwa auf der gleichen Breite wie Pasto \n- liegt nahe am Fluss Caquetá",
	  vocHelp: 'die Breite - la latitud',
	  lng: -76.651055,
	  lat: 1.15234
	}, {
	  name: 'San José del Guaviare',
	  description: "- Hauptstadt des Departamento Guaviare in Zentralkolumbien \n- liegt südöstlich von Bogotá und Villavicencio am Fluss Guaviare",
	  vocHelp: 'die Gemeinde - el municipio \n - der Golf - el golfo \n - die Hafenstadt - la ciudad portuaria',
	  lng: -72.633333,
	  lat: 2.566667
	}, {
	  name: 'Mitú',
	  description: "- Stadt in Südostkolumbien im Departamento Vaupés am Fluss Vaupés \n- liegt südostlich von San José del Guaviare",
	  vocHelp: '',
	  lng: -70.233618,
	  lat: 1.252174
	}, {
	  name: 'Isla de Tierra Bomba',
	  description: "- Insel an der kolumbianischen Karibikküste \n- grenzt die Bahía de Cartagena de Indias vom Meer ab",
	  vocHelp: '- die Küste - la costa \n - abgrenzen von.../trennen von... - separar de...',
	  lng: -75.575833,
	  lat: 10.3525
	}, {
	  name: 'Villa de Leyva',
	  description: "- liegt im Departamento Boyacá \n- liegt nordwestlich von Tunja und westlich vom Páramo de Iguaque",
	  vocHelp: '',
	  lng: -73.533333,
	  lat: 5.633333
	}, {
	  name: 'Islas del Rosario',
	  description: "- liegen südwestlich von der Isla de Tierra Bomba und Cartagena im karibischem Meer",
	  vocHelp: '',
	  lng: -75.766667,
	  lat: 10.166667
	}, {
	  name: 'La Plata',
	  description: "- liegt etwa im Mittelpunkt des Vierecks Cali-Popayán-Florencia-Neiv",
	  vocHelp: '- das Viereck - el cuadrilátero',
	  lng: -75.892222,
	  lat: 2.393333
	}, {
	  name: 'Itagüí',
	  description: "- grenzt im Nordosten an Medellín",
	  vocHelp: '',
	  lng: -75.598889,
	  lat: 6.184444
	}, {
	  name: 'Barrancabermeja',
	  description: "- liegt westlich von Bucaramanga und etwa auf der gleichen Breite \n- liegt am Río Magdalena am östlichen Ufer",
	  vocHelp: '- die Breite - la latitud \n	am Ufer der/des...liegen - estar a orillas de...',
	  lng: -73.854444,
	  lat: 7.065278
	}, {
	  name: 'La Paz',
	  description: "- gleicher Name wie der Regierungssitz in Bolivien \n- etwa auf der gleichen Breite wie Medellín; Río Magdalena wie Symmetrieachse",
	  vocHelp: '- die Breite - la latitud \n- die Symmetrieachse - el eje de simetría \n- der Regierungssitz - la sede del Gobierno',
	  lng: -73.173056,
	  lat: 10.384167
	}, {
	  name: 'Tutunendó',
	  description: "- Ortschaft in der Nähe von Quibdó: liegt nordöstlich von Quibdó",
	  vocHelp: '',
	  lng: -76.533333,
	  lat: 5.75
	}, {
	  name: 'Palmira',
	  description: "- befindet sich nordöstlich von Cali \n- hat fast den gleichen Namen wie eine syrische Stadt",
	  vocHelp: '- syrisch - sirio',
	  lng: -76.3036100,
	  lat: 3.5394400
	}, {
	  name: 'Pitalito',
	  description: "- befindet sich auf der Linie Popayán-Florencia in Westkolumbien",
	  vocHelp: '- die Linie - la línea',
	  lng: -76.0478500,
	  lat: 1.8496600
	}, {
	  name: 'Gigante',
	  description: "- liegt etwa auf der gleichen Breite und östlich von La Plata",
	  vocHelp: '- die Breite - la latitud',
	  lng: -75.5453100,
	  lat: 2.3867700
	}, {
	  name: 'Ipiales',
	  description: "- liegt im Südwesten Kolumbiens an der Grenze zu Ecuador \n- liegt südwestlich von Pasto",
	  vocHelp: '- die Grenze - la frontera',
	  lng: -77.6495900,
	  lat: 0.8301800
	}, {
	  name: 'Puerto Asís',
	  description: "- liegt in Südwestkolumbien \n- liegt sehr weit im Südosten von Pasto",
	  vocHelp: 'weit - distante',
	  lng: -76.50019099999997,
	  lat: 0.504929
	}, {
	  name: 'La Pedrera',
	  description: "- liegt in Südkolumbien am Río Caquetá",
	  vocHelp: '- am Ufer der/des...liegen - estar a orillas de...',
	  lng: -69.566667,
	  lat: -1.316667
	}, {
	  name: 'Puerto Nariño',
	  description: "- nach Leticia die südlichste Stadt Kolumbiens",
	  vocHelp: '',
	  lng: -70.35660000000001,
	  lat: -3.79009
	}, {
	  name: 'Tarapacá',
	  description: "- liegt in Südkolumbien am Río Putumayo",
	  vocHelp: '- am Ufer der/des...liegen - estar a orillas de...',
	  lng: -69.7442,
	  lat: -2.87861
	}, {
	  name: 'Apartadó',
	  description: "- liegt südöstlich von Turbo",
	  vocHelp: '',
	  lng: -76.6667,
	  lat: 7.86667
	}, {
	  name: 'Luohu',
	  description: "- nördlichste Stadt Kolumbiens",
	  vocHelp: '',
	  lng: -71.8,
	  lat: 12.2833
	}, {
	  name: 'Soledad',
	  description: "- befindet sich Nordkolumbien südlich von Barranquilla",
	  vocHelp: '',
	  lng: -74.76459,
	  lat: 10.91843
	}, {
	  name: 'Pamplona',
	  description: "- liegt in Nordostkolumbien \n- liegt südwestlich von Cúcuta und nordöstlich von Bucaramanga und Floridablanca",
	  vocHelp: '',
	  lng: -72.6479500,
	  lat: 7.3756500
	}, {
	  name: 'Floridablanca',
	  description: "- schließt sich südlich von Bucaramanga an \n- Name setzt sich zusammen aus dem Namen eines amerikan. Bundesstaates",
	  vocHelp: '- sich anschließen - seguir a \n- sich zusammensetzen aus - componerse de',
	  lng: -73.0864400,
	  lat: 7.0622200
	}, {
	  name: 'Arauquita',
	  description: "- liegt in Nordostkolumbien am Río Cutufi \n- liegt nahe der Grenze zu Venezuela",
	  vocHelp: '- am Ufer der/des...liegen - estar a orillas de... \n- die Grenze - la frontera',
	  lng: -71.4294759,
	  lat: 7.029334
	}, {
	  name: 'Caucasia',
	  description: "- befindet sich südöstlich von Montería und südlich von Sincelejo",
	  vocHelp: '',
	  lng: -75.19856290000001,
	  lat: 7.979698
	}, {
	  name: 'Planeta Rica',
	  description: "- befindet sich etwa auf der Mitte der Linie Montería-Caucasia",
	  vocHelp: '- die Linie - la línea',
	  lng: -75.584048,
	  lat: 8.412749
	}, {
	  name: 'Aguachica',
	  description: "- befindet sich in Nordostkolumbien \n- Name setzt sich zusammen aus „Wasser“ + „Mädchen“",
	  vocHelp: '- sich zusammensetzen aus - componerse de',
	  lng: -73.61166500000002,
	  lat: 8.305925
	}, {
	  name: 'Sabanalarga',
	  description: "- befindet sich in Nordkolumbien nordwestlich von Medellín",
	  vocHelp: '',
	  lng: -74.920163,
	  lat: 10.632409
	}, {
	  name: 'Magangué',
	  description: "- befindet sich in Nordkolumbien  \n- befindet sich östlich von Sincelejo und südöstlich von Cartagena",
	  vocHelp: '',
	  lng: -74.75275870000002,
	  lat: 9.2414156
	}, {
	  name: 'El Carmen de Bolívar',
	  description: "- liegt in Nordkolumbien \n- befindet sich südöstlich von Cartagena und nordöstlich von Sincelejo",
	  vocHelp: '',
	  lng: -75.1202300,
	  lat: 9.7174000
	}, {
	  name: 'Sogamoso',
	  description: "- liegt nordöstlich von Bogotá und Tunja",
	  vocHelp: '',
	  lng: -72.9339100,
	  lat: 5.7143400
	}, {
	  name: 'Ocaña',
	  description: "- liegt in Nordostkolumbien östlich von Aguachica",
	  vocHelp: '',
	  lng: -73.3560400,
	  lat: 8.2377300
	}, {
	  name: 'Tumaco',
	  description: "- liegt in Südwestkolumbien \n- Hafenstadt an der pazifischen Küste",
	  vocHelp: '- der Pazifik - el Océano Pacífico \n- die Küste - la costa',
	  lng: -78.80209400000001,
	  lat: 1.80009
	}, {
	  name: 'Maicao',
	  description: "- befindet sich südöstlich von Riohacha in Nordkolumbien",
	  vocHelp: '',
	  lng: -72.24851710000002,
	  lat: 11.3789335
	}, {
	  name: 'Fundación',
	  description: "- befindet sich südlich von Santa Marta und südöstlich von Barranquilla",
	  vocHelp: '',
	  lng: -74.1819979,
	  lat: 10.517179
	}, {
	  name: 'Ciénaga',
	  description: "- liegt in Nordkolumbien \n- liegt südlich von Santa Marta und östlich von Barranquilla",
	  vocHelp: '',
	  lng: -74.2476500,
	  lat: 11.0070300
	}, {
	  name: 'El Banco',
	  description: "- liegt südöstlich von Magangué und Sincelejo",
	  vocHelp: '',
	  lng: -73.97386399999999,
	  lat: 9.003506999999999
	}, {
	  name: 'Plato',
	  description: "- liegt in Nordkolumbien \n- liegt östlich von El Carmen de Bolívar und Sincelejo",
	  vocHelp: '',
	  lng: -74.7824400,
	  lat: 9.790290
	}, {
	  name: 'Duitama',
	  description: "- liegt nordöstlich von Tunja und nordwestlich von Sogamoso",
	  vocHelp: '',
	  lng: -73.03292729999998,
	  lat: 5.8268951
	}, {
	  name: 'La Dorada',
	  description: "- heißt auf dt.: „die Goldbrasse“ \n- liegt südöstlich von Medellín und nordwestlich von Bogotá",
	  vocHelp: '',
	  lng: -74.66798399999999,
	  lat: 5.472709
	}];

	module.exports.default = locations;

/***/ }
/******/ ]);