// the react lib
import React from 'react'
// dynamic lang
import lang from '../lang.jsx'
// the scoreboard component
import ScoreBoard from './ScoreBoard.jsx'

export default ({ players }) => {
  return (
    <div>
      <h2>{lang.gameOver}</h2>
      <ScoreBoard players={players} />
    </div>
  )
}