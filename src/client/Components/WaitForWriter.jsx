// react lib
import React from 'react'
// dynamic lang files
import lang from '../lang.jsx'

import RandomGif from './RandomGif.jsx'
// stateless component
export default () => {
  // just the wait message
  return (
    <div>
        <h2>{lang.waitForWriter}.</h2>
        <RandomGif />
    </div>
  )
}
