import React from 'react'

import lang from '../lang.jsx'
import renderMap from '../renderMap.jsx'

export default class Write extends React.Component {
  componentDidMount() {
    const latLng = {lat: this.props.location.lat, lng: this.props.location.lng}
    const zoom = 8
    renderMap(
      latLng,
      zoom,
      false,
      document.getElementById('writeMap'),
      [{latLng: latLng}]
    )
  }

  render () {
    const handleSubmit = () => {
      console.log('submitDescription')
      this.props.submitDescription(this.text.value)
    }

    return (
      <div>
        <h2>{lang.youAreTheWriter}</h2>
        <textarea defaultValue={lang.yourDescriptionHere} ref={(ref) => this.text = ref}></textarea>
        <h3>{lang.youDescribe}: {this.props.location.name}</h3>
        {this.props.location.description}
        <h3>{lang.vocHelp}</h3>
        {this.props.location.vocHelp}

        <h3>{lang.locationOnMap}</h3>
        <div id="writeMap" style={{height: '25vh'}}>
        </div>

        <br />
        <button onClick={handleSubmit}>{lang.submit}</button>
      </div>
    )
  }
}