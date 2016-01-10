import React from 'react'
import reactDOM from 'react-dom'
import { store } from './redux.jsx'

import App from './Components/App.jsx'
import setUpListeners from './eventListeners.jsx'

// the function that does the heavy lifting for rendering
export default (socket) => {
  setUpListeners(socket, store)

  // the render it self
  const renderIt = () => {
    reactDOM.render(<App
      // all the stuff that needs to be injected
      state={store.getState()}

      goToNameScreen={() => {
        store.dispatch({
          type: 'CHANGE_SCREEN',
          target: 'NAME',
        })
      }}

      setName={(name) => {
        store.dispatch({
          type: 'SET_NAME',
          newName: name
        })

        store.dispatch({
          type: 'CHANGE_SCREEN',
          target: 'WAIT_FOR_OTHER_PLAYERS'
        })
      }}

      startGame={() => {
        console.log('starting game')
        socket.emit('start game')
      }}

      submitDescription={(description) => {
        store.dispatch({type: 'SET_USER_DESCRIPTION', description: description})
      }}

      submitGuess={() => {
        store.dispatch({type: 'SUBMIT_GUESS'})
      }}

      reset={() => {
        socket.emit('reset')
      }}


    />, document.getElementById('mount'))
  }
  // rerender on data change
  store.subscribe(() => {renderIt()})
  // initial render
  renderIt()
}
