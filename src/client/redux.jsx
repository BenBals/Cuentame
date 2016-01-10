import React from 'react'
import reactDOM from 'react-dom'
import { createStore } from 'redux'

import App from './Components/App.jsx'

// the redux reducer
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state -1
    default:
      return state
  }
}

// create the redux store
const store = createStore(reducer)

// the function that does the heavy lifting for rendering
const renderToPage = () => {
  // the render it self
  const renderIt = () => {
    reactDOM.render(<App state={store.getState()} />, document.getElementById('mount'))
  }
  // rerender on data change
  store.subscribe(() => {renderIt()})
  // initial render
  renderIt()
}

export { store, renderToPage }
