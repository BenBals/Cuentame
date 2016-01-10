import { createStore } from 'redux'
import { assign, reduce } from 'lodash'

const socket = io() // being injected through the script tag

const defaultState = {
  screen: 'HELLO',
  players: [],
  name: ''
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
        (found, item) => {found ? found : action.newName === item.name},
        false
      )

      if ((action.newName !== '') && (!reduce(store.getState().players, (found, item) => {found ? found : action.newName === item.name}))) {
        socket.emit('add player', action.newName)

        return assign(state, {
          name: action.newName
        })
      } else {
        return state
      }
    case 'UPDATE_PLAYERS':
      return assign(state, {
        players: action.newPlayers
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
