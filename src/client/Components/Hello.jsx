// react lib
import React from 'react'

// dynmic lang files
import lang from '../lang.jsx'

// stateles components
export default (props) => {
  // get the go or reset button depending on wether there is a running game
  const goOrReset = () => {
    return props.status === 'NOT_STARTED' ? <button onClick={props.goToNameScreen}>Go</button> : (
      <div>
        <span>{lang.gameRunningWantToReset}</span>
        <button onClick={props.reset}>{lang.reset}</button>
      </div>
    )
  }

  // render it all to the page with the right headline
  return (
    <div>
      <h1>{lang.name}</h1>
      {goOrReset()}
    </div>
  )
}
