import React from 'react'
import reactDOM from 'react-dom'
import { createStore } from 'redux'
import { assign } from 'lodash'


import setUpListeners from './eventListeners.jsx'
import App from './Components/App.jsx'

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

// the function that does the heavy lifting for rendering
const renderToPage = (socket) => {
  setUpListeners(socket, store)

  // the render it self
  const renderIt = () => {
    reactDOM.render(<App
      // all the stuff that needs to be injected
      state={store.getState()}

      sendAMessage={(msg)=>{
        socket.emit('message', msg)
      }}

      goToNameScreen={() => {
        store.dispatch({
          type: 'CHANGE_SCREEN',
          target: 'NAME'
        })
      }}

      setName={(name) => {
        store.dispatch({
          type: 'SET_NAME',
          newName: name
        })
      }}


    />, document.getElementById('mount'))
  }
  // rerender on data change
  store.subscribe(() => {renderIt()})
  // initial render
  renderIt()
}

// exporting all of that
export { store, renderToPage }
