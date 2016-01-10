import React from 'react'

import lang from '../lang.jsx'

export default (props) => {
  return (
    <div>
      <h1>{lang.name}</h1>
      <button onClick={props.goToNameScreen}>Go</button>
    </div>
  )
}
