// the react lib
import React from 'react'
import lang from '../lang.jsx'

// stateless component
export default class RemovePlayer extends React.Component {
    render () {
    const getLi = () => {
        if (this.props.players.length !== 0) {
            // dont modify the original array
            return [].concat(this.props.players)
              .sort((a,b) => {
                  if (a.score > b.score) {
                      return -1;
                  } else if (a.score < b.score) {
                      return 1;
                  } else {
                      return 0
                  }
              })
                     .map((player) => {
                         //return an li for every player
                         return <li>
                         {player.name}: <a className="btn-flat" onClick={() => {
                                 this.props.removePlayer(player.name)
                         }}>{lang.remove}</a>
</li>
                     });
        } else {
            return <p>No players are logged in</p>
        }
    }
        // return an ordered list
        return (
            <div className="removePlayer">
                <div className="center-div">
            <h1 className="text-align-center">{lang.removePlayer}</h1>
            <ol>{getLi()}</ol>
            <p>{lang.resetRoundWarning}</p>
            <a className="btn" onClick={this.props.closeRemovePlayer}>{lang.back}</a>
                </div>
    </div>
        )
    }
}
