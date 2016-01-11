// recat lib
import React from 'react'

// and that lang stuff
import lang from '../lang.jsx'

// stateless component
export default (props) => {
  // only enable the start game button if at least 2 players are connecet
  const button = props.players.length > 1 ? <button onClick={props.startGame}>{lang.startGame}</button> : <div></div>

  // render func
  return (
    <div>
      {/* right (sub-)titels */}
      <h2>{lang.waitingForOtherPlayers}</h2>
      <h3>{lang.connected}:</h3>
      {/* list of connecet players*/}
      <ul>
        {
          props.players.map((player) => {
            return <li>{player.name}</li>
          })
        }
      </ul>

      {/* insert the button (or not) */}
      {button}
    </div>
  )
}
