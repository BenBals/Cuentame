import React from 'react'

import lang from '../lang.jsx'

export default (props) => {
  const goOrReset = () => {
    return props.status === 'NOT_STARTED' ? <button onClick={props.goToNameScreen}>Go</button> : (
      <div>
        <span>{lang.gameRunningWantToReset}</span>
        <button onClick={props.reset}>{lang.reset}</button>
      </div>
    )
  }

  return (
    <div>
      <h1>{lang.name}</h1>
      {goOrReset()}
    </div>
  )
}
