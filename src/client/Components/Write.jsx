import React from 'react'
import GoogleMap from 'google-map-react'

import lang from '../lang.jsx'

export default (props) => {
  return (
    <div>
      <h2>{lang.youAreTheWriter}</h2>
      <textarea defaultValue={lang.yourDescriptionHere}></textarea>
      <h3>{lang.youDescribe}: {props.location.name}</h3>
      {props.location.description}
      <h3>{lang.vocHelp}</h3>
      {props.location.vocHelp}

      <h3>{lang.locationOnMap}</h3>


      <br />
      <button>{lang.submit}</button>
    </div>
  )
}
