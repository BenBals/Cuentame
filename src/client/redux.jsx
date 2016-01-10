import { createStore } from 'redux'
import { assign } from 'lodash'

const defaultState = {
  screen: 'HELLO'
}

// the redux reducer
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CHANGE_SCREEN':
      return assign(state, {
        screen: action.target
      })
    case 'SET_NAME':
      return assign(state, {
        name: action.newName
      })
    default:
      return state
  }
}

// create the redux store
const store = createStore(reducer)

// exporting all of that
export { store }
