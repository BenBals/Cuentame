import { createStore } from 'redux'
import { assign, reduce } from 'lodash'

const socket = io() // being injected through the script tag

const defaultState = {
  screen: 'HELLO',
  players: [],
  name: '',
  status: 'NOT_STARTED'
}

// the redux reducer
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CHANGE_SCREEN':
      return assign(state, {
        screen: action.target
      })
    case 'SET_NAME':
      const newNameIsntEmpty = action.newName !== ''

      const newNameIsntTaken = !reduce(
        store.getState().players,
        (found, item) => {
          return found ? found : action.newName === item.name
        },
        false
      )

      const isValid = newNameIsntEmpty && newNameIsntTaken

      if (isValid) {
        socket.emit('add player', action.newName)

        return assign(state, {
          name: action.newName
        })
      } else {
        return state
      }
    case 'UPDATE_PLAYERS':
      const thisPlayer = action.newPlayers.reduce((acc, player) => {
        return player.name === state.name ? player : acc
      }, null)
      return assign(state, {
        players: action.newPlayers,
        score: thisPlayer.score ? thisPlayer.score : 0
      })
    case 'SET_INITIAL_DATA':
      return assign(state, action.data)
    case 'START_NEW_ROUND':
      const nextScreen = action.data.writer === state.name ? 'WRITE' : 'WAIT_FOR_WRITER'
      return assign(state, action.data, {
        screen: nextScreen,
        status: 'PLAYING'
      })
    case 'SET_USER_DESCRIPTION':
      socket.emit('submit description', action.description)

      return assign(state, {
        userDescription: action.description
      })
    case 'SUBMITTED_USER_DESCRIPTION':
      const nextScreen2 = state.writer === state.name ? 'WAIT_FOR_ANSWER' : 'ANSWER'

      return assign(state, {
        userDescription: action.description
      }, {
        screen: nextScreen2
      })
    case 'PLACE_MARKER':
      console.log(action.latLng)
      return assign(state, {
        marker: {
          latLng: {
            lat: action.latLng.lat(),
            lng: action.latLng.lng()
          }
        }
      })
    case 'SUBMIT_GUESS':
      socket.emit('submit guess', {
        latLng: state.marker.latLng,
        name: state.name
      })
      return assign(state, {
        screen: 'WAIT_FOR_ANSWER'
      })
    case 'SET_ROUND_WINNER':
      return assign(state, {
        winner: action.roundWinner,
        screen: 'SHOW_ROUND_WINNER'
      })
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
