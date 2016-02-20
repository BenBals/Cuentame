// react lib
import React from 'react'
// lang files
import lang from '../lang.jsx'

import RandomGif from './RandomGif.jsx'

// just sayin "waiting for answer"
export default () => {
  return (
    <div>
        <h2>{lang.waitForAnswer}</h2>
        <RandomGif />
    </div>
  )
}
