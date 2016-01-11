// getting all the libs
import React from 'react'
import reactDOM from 'react-dom'
import { store } from './redux.jsx'

// getting the App Component and the func that sets up the socket listeners
import App from './Components/App.jsx'
import setUpListeners from './eventListeners.jsx'

// the function that does the heavy lifting for rendering
export default (socket) => {
  // set up the socket listeners
  setUpListeners(socket, store)

  // the render it self
  const renderIt = () => {
    reactDOM.render(<App
      // all the stuff that needs to be injected
      state={store.getState()}

      // the function that makes the screen change to name
      goToNameScreen={() => {
        store.dispatch({
          type: 'CHANGE_SCREEN',
          target: 'NAME',
        })
      }}

      // set the current name and go to the next screen
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

      // start the game
      startGame={() => {
        console.log('starting game')
        socket.emit('start game')
      }}

      // submit your description
      submitDescription={(description) => {
        store.dispatch({type: 'SET_USER_DESCRIPTION', description: description})
      }}

      // submit your guess
      submitGuess={() => {
        store.dispatch({type: 'SUBMIT_GUESS'})
      }}

      // RESET
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
