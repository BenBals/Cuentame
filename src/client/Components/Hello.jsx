// react lib
import React from 'react'

// dynmic lang files
import lang from '../lang.jsx'

// stateles components
export default (props) => {
  // get the go or reset button depending on wether there is a running game
  const goOrReset = () => {
    return props.status === 'NOT_STARTED' ? <a className="waves-effect waves-light btn" onClick={props.goToNameScreen}>{lang.go}</a> : (
      <div>
        <span>{lang.gameRunningWantToReset}</span>
        <a onClick={props.reset} className="waves-effect waves-light btn">{lang.reset}</a>
      </div>
    )
  }

  // render it all to the page with the right headline
  return (
    <div>
      <h1 className="text-align-center">{lang.name}</h1>
      <div className='center-div'>
        {goOrReset()}
      </div>
    </div>
  )
}
