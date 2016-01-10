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

	state = {
	  status: 'NOT_STARTED',
	  players: [],
	  locations: [{
	    name: 'Bogota',
	    description: "- Hauptstadt von Kolumbien",
	    vocHelp: 'Hauptstadt - capital',
	    long: '12E',
	    lat: '12N'
	  }],
	  round: 0
	};

	// the port on which the server runs
	SERVER_PORT = 3000;

	// respond with the index.html file when asked for /
	app.get('/', (req, res) => {
	  var filePath = path.resolve('build/client/index.html');
	  res.sendFile(filePath);
	});

	// give them the client.bundle.js when they want it
	app.get('/client.bundle.js', (req, res) => {
	  var filePath = path.resolve('build/client/client.bundle.js');
	  res.sendFile(filePath);
	});

	Array.prototype.random = function () {
	  return this[Math.floor(Math.random() * this.length)];
	};

	const startNewRound = () => {
	  state.round = state.round + 1;
	  state.currentLocation = state.locations.random();
	  state.guesses = {};
	  state.writer = state.players.random().name;
	  state.userDescription = '';

	  io.emit('start new round', {
	    writer: state.writer,
	    location: state.currentLocation,
	    userDescription: state.userDescription
	  });
	};

	// what to do when a user connects
	io.on('connection', function (socket) {
	  console.log('a user connected');
	  // log the disconnect too
	  socket.on('disconnect', () => {
	    console.log('user disconnected');
	  });

	  socket.emit('initial data', {
	    players: state.players
	  });

	  socket.on('message', msg => {
	    console.log(msg);
	    io.emit('INCREMENT');
	  });

	  socket.on('add player', name => {
	    state.players.push({
	      name: name,
	      score: 0
	    });

	    console.log(state);

	    io.emit('update players', state.players);
	  });

	  socket.on('start game', () => {
	    console.log('started game');
	    state.status = 'PLAYING';

	    startNewRound();
	  });
	});

	// start the server on port SERVER_PORT
	http.listen(SERVER_PORT, function () {
	  console.log('listening on *: ', SERVER_PORT);
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

/***/ }
/******/ ]);