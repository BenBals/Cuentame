import React from 'react'
import lang from '../lang.jsx'

export default ({ players }) => {
  const getScoreList = () => {

  }
  return (
    <div>
      <h1>{lang.roundEndMessages}</h1>
      {getScoreList}

      <ul>
        {players.map((player) => {
          return <li>{player.name}: {player.score}</li>
        })}
      </ul>

      <div>{lang.nextRoundIn10s}</div>
    </div>
  )
}