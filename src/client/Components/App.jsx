import React from 'react'

import lang from '../lang.jsx'

// import Hello from '.Hello.jsx'


export default class App extends React.Component {
  render() {

    child = <div>{lang.randomError}</div>

    switch (this.props.state.screen) {
      case 'HELLO':
        child = <Hello />
    }

    return (
      <div>

        {child}

        {/* just in dev */}
        <hr />
        <div>
          state:
          {this.props.state}
        </div>
      </div>
    )
  }
}
