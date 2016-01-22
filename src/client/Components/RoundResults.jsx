// same as always... react and dynamic lang files
import React from 'react'
import lang from '../lang.jsx'
import ScoreBoard from './ScoreBoard.jsx'

// stateless component
export default ({ players }) => {
  return (
    <div>
      {/* the right heading */}
      <h2>{lang.roundEndMessage}</h2>
      {/* lit of all users and their scores */}
      <ScoreBoard players={players} />

      {/* tell them that the next round starts in 10s */}
      <div>{lang.nextRoundIn10s}</div>
    </div>
  )
}
