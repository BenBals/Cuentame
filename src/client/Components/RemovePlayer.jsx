// the react lib
import React from 'react'
import lang from '../lang.jsx'

// stateless component
export default class RemovePlayer extends React.Component {
    render () {
        // return an ordered list
        return (
            <div>
            <h1 className="text-align-center">{lang.removePlayer}</h1>
            <ol>
            {
                if (this.props.players.length === 0) {
                    // dont modify the origional array
                    [].concat(this.props.players)
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
                          return <li>{player.name}: <a className="btn-flat" onClick={() => {
                              this.props.removePlayer(player.name)
                          }}>{lang.remove}</a></li>
                      })
                } else {
                    <li>No players are logged in<li>
                }
            }
      </ol>
    </div>
        )
    }
}
