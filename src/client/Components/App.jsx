import React from 'react'

import lang from '../lang.jsx'

import Hello from './Hello.jsx'
import Name from './Name.jsx'
import WaitForOtherPlayers from './WaitForOtherPlayers.jsx'
import WaitForWriter from './WaitForWriter.jsx'
import Write from './Write.jsx'
import Answer from './Answer.jsx'
import WaitForAnswer from './WaitForAnswer.jsx'
import ShowRoundWinner from './ShowRoundWinner.jsx'

export default class App extends React.Component {
  render() {

    const getChild = () => {
      switch (this.props.state.screen) {
        case 'HELLO':
          return <Hello goToNameScreen={this.props.goToNameScreen}/>
        case 'NAME':
          return <Name setName={this.props.setName}/>
        case 'WAIT_FOR_OTHER_PLAYERS':
          return <WaitForOtherPlayers players={this.props.state.players} startGame={this.props.startGame}/>
        case 'WAIT_FOR_WRITER':
          return <WaitForWriter />
        case 'WRITE':
          return <Write location={this.props.state.location} submitDescription={this.props.submitDescription}/>
        case 'ANSWER':
          return <Answer description={this.props.state.userDescription} submitGuess={this.props.submitGuess}/>
        case 'WAIT_FOR_ANSWER':
          return <WaitForAnswer />
        case 'SHOW_ROUND_WINNER':
          return <ShowRoundWinner winner={this.props.state.winner}/>
        default:
          return <div>{lang.randomError}</div>
      }
    }

    const getScoreHeader = () => {
      return this.props.state.status === 'PLAYING' ? (<div>{lang.yourScore}: {this.props.state.score}</div>) : null
    }

    return (
      <div>

        {getScoreHeader()}

        {getChild()}

        {/* just in dev */}
        <hr />
        <div>
          state:
          {JSON.stringify(this.props.state, null, 2)}
        </div>
      </div>
    )
  }
}
