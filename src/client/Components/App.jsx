// importing the react library
import React from 'react'

// and the dynamic lang files
import lang from '../lang.jsx'

// the other components/screens
import Hello from './Hello.jsx'
import Name from './Name.jsx'
import WaitForOtherPlayers from './WaitForOtherPlayers.jsx'
import WaitForWriter from './WaitForWriter.jsx'
import Write from './Write.jsx'
import Answer from './Answer.jsx'
import WaitForAnswer from './WaitForAnswer.jsx'
import RoundResults from './RoundResults.jsx'
import EndResults from './EndResults.jsx'
import RemovePlayer from './RemovePlayer.jsx'

export default class App extends React.Component {
  render() {
    // function that determains the component to render based on state and pass the needed state
    const getChild = () => {
      switch (this.props.state.screen) {
        case 'HELLO':
          return <Hello goToNameScreen={this.props.goToNameScreen} status={this.props.state.status} reset={this.props.reset}/>
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
        case 'ROUND_RESULTS':
          return <RoundResults players={this.props.state.players}/>
        case 'END_RESULTS':
          return <EndResults players={this.props.state.players} reset={this.props.reset}/>
        case 'REMOVE_PLAYER':
          return <RemovePlayer removePlayer={this.props.removePlayer} players={this.props.state.players}/>
        default:
          return <div>{lang.randomError}</div>
      }
    }

    // determain if the score header should be shown
    const getScoreHeader = () => {
      return (this.props.state.status === 'PLAYING' && this.props.state.screen !== 'HELLO') ? (<div>{lang.yourScore}: {this.props.state.score}</div>) : null
    };

      const getRemovePlayerBtn = () => {
          if (this.props.state.screen !== "REMOVE_PLAYER") {
            return (<div>
                <a className="btn-flat" onClick={this.props.goToRemovePlayer}>{lang.removePlayer}</a>
            </div>);
          }
      };

    return (
      <div className="container">

        {/* get the header */}
        {getScoreHeader()}

        {/* and the screen */}
        {getChild()}


        {getRemovePlayerBtn()}

        {/* just in dev */}
        {/*
        <div>
          state:
          {JSON.stringify(this.props.state, null, 2)}
        </div>
        <a className="waves-effect waves-light btn" onClick={this.props.reset}>reset</a>
        */}
      </div>
    )
  }
}
