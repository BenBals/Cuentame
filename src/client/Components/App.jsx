import React from 'react'

import lang from '../lang.jsx'

import Hello from './Hello.jsx'
import Name from './Name.jsx'
import WaitForOtherPlayers from './WaitForOtherPlayers.jsx'

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
        default:
          return <div>{lang.randomError}</div>
      }
    }

    return (
      <div>

        {getChild()}

        {/* just in dev */}
        <hr />
        <div>
          state:
          {JSON.stringify(this.props.state)}
        </div>
      </div>
    )
  }
}
