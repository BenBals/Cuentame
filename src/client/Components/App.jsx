import React from 'react'

import lang from '../lang.jsx'

import Hello from './Hello.jsx'


export default class App extends React.Component {
  render() {

    const getChild = () => {
      switch (this.props.state.screen) {
        case 'HELLO':
          return <Hello goToNameScreen={this.props.goToNameScreen}/>
        case 'NAME':
          return <Name />
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
