// getting the needed stuff from the libs
import { createStore } from 'redux'
import { assign, reduce } from 'lodash'

// dynamic lang files
import lang from './lang.jsx'

const socket = io() // being injected through the script tag

// the default data
const defaultState = {
  screen: 'HELLO',
  players: [],
  name: '',
  status: 'NOT_STARTED'
}

// the redux reducer
const reducer = (state = defaultState, action) => {
  // checking the action types
  switch (action.type) {
    // changing the screen
    case 'CHANGE_SCREEN':
      return assign({}, state, {
        screen: action.target
      })
    // setting the names if it isnt taken
    case 'SET_NAME':
      // check if its empty
      const newNameIsntEmpty = action.newName !== ''
      // and if someone else took it
      const newNameIsntTaken = !reduce(
        state.players,
        (found, item) => {
          return found ? found : action.newName === item.name
        },
        false
      )

      // combining that into the isValid flag
      const isValid = newNameIsntEmpty && newNameIsntTaken

      // if its valid change the name, if not then not
      if (isValid) {
        socket.emit('add player', action.newName)

        return assign({}, state, {
          name: action.newName,
          screen: 'WAIT_FOR_OTHER_PLAYERS'
        })
      } else {
        alert(lang.nameTaken)
        return state
      }
    // getting new player data
    case 'UPDATE_PLAYERS':
      // the data for the current player
      const thisPlayer = action.newPlayers.reduce((acc, player) => {
        return player.name === state.name ? player : acc
      }, null)

      // updating the players and the own score
      return assign({}, state, {
        players: action.newPlayers,
        score: thisPlayer ? thisPlayer.score : 0
      })
    // getting the initial data and resetting all old data
    case 'SET_INITIAL_DATA':
      return assign({}, state, defaultState, action.data)
    // what to do when a new round starts
    case 'START_NEW_ROUND':
      // the next screen depending on wether you are writer, answerer or not in the game
      const nextScreen = () => {
        switch (state.name) {
          case action.data.writer:
            return 'WRITE'
          case "":
            return 'HELLO'
          default:
            return 'WAIT_FOR_WRITER'
        }
      }
      // go to that screen and set the status to playing
      return assign({}, state, action.data, {
        screen: nextScreen(),
        round: state.route + 1,
        status: 'PLAYING'
      })
    // the writer submitted the discription
    case 'SET_USER_DESCRIPTION':
      // send the description to the server
      socket.emit('submit description', action.description)
      // and setting it on the store
      return assign({}, state, {
        userDescription: action.description
      })
    // getting the user description form the server
    case 'SUBMITTED_USER_DESCRIPTION':
      // next screen based on whether you are writer or answerer
      const nextScreen2 = state.writer === state.name ? 'WAIT_FOR_ANSWER' : 'ANSWER'

      // setting the description and the new screen
      return assign({}, state, {
        userDescription: action.description,
        screen: nextScreen2
      })
    // placing the marken
    case 'PLACE_MARKER':
      return assign({}, state, {
        marker: {
          latLng: {
            lat: action.latLng.lat(),
            lng: action.latLng.lng()
          }
        }
      })
    // and submit the guess to the server
    case 'SUBMIT_GUESS':
      // send your name and the latLng of the marker to the server
      socket.emit('submit guess', {
        latLng: state.marker.latLng,
        name: state.name
      })
      // waiting for other players to answer screen
      return assign({}, state, {
        screen: 'WAIT_FOR_ANSWER'
      })
    case 'END_GAME':
      return assign({}, state, {
        screen: 'END_RESULTS',
        players: action.players
      })
    case 'SET_REMOVE_PLAYER':
        console.log('i am cool')
        return assign({}, state, {
          removePlayer: action.open
        })
    // the fallback
    default:
      return state
  }
}

// create the redux store
const store = createStore(reducer)

// export for debug purposes
window.store = store

// exporting all of that
export { store, socket }
