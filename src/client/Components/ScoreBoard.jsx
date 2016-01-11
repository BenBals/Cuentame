// the react lib
import React from 'react'

// stateless component
export default ({ players }) => {
  // return an ordered list
  return (
    <ol>
      {
        // dont modify the origional array
        [].concat(players)
        // sort in by score
        .sort((a,b) => {
          if (a.score > b.score) {
            return -1
          } else if (a.score < b.score) {
            return 1
          } else {
            return 0
          }
        })
        // map over the array
        .map((player) => {
          // return an li for every player
          return <li>{player.name}: {player.score}</li>
        })
      }
    </ol>
  )
}