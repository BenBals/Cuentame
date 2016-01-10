import React from 'react'

import lang from '../lang.jsx'

export default (props) => {
  return (
    <div>
      <h2>{props.winner.name} {lang.winsThisRound}</h2>
      <span>{lang.theirDistaceWas} {props.winner.distance} {lang.meters}</span>
    </div>
  )
}
