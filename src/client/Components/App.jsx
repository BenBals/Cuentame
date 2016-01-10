import React from 'react'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => {this.props.sendAMessage('hello')}}>send a message</button>
        <div>
          state:
          {this.props.state}
        </div>
      </div>
    )
  }
}
