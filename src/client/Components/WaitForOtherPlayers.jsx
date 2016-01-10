import React from 'react'

import lang from '../lang.jsx'

export default (props) => {
  const button = props.players.length > 1 ? <button onClick={props.startGame}>{lang.startGame}</button> : <div></div>
  return (
    <div>
      <h2>{lang.waitingForOtherPlayers}</h2>
      <h3>{lang.connected}:</h3>
      <ul>
        {
          props.players.map((player) => {
            return <li>{player.name}</li>
          })
        }
      </ul>
      {button}
    </div>
  )
}
