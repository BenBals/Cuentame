import React from 'react'

import lang from '../lang.jsx'

export default class Write extends React.Component {
  componentDidMount() {
    console.log('the component did mount')
    const latLng = {lat: this.props.location.lat, lng: this.props.location.lng}

    const map = new google.maps.Map(document.getElementById('writeMap'), {
      center: latLng,
      zoom: 8
    })

    const marker = new google.maps.Marker({
      position: latLng,
      title: "Hello World!"
    })

    marker.setMap(map)

    window.writeMap = map

  }

  render () {
    return (
      <div>
        <h2>{lang.youAreTheWriter}</h2>
        <textarea defaultValue={lang.yourDescriptionHere}></textarea>
        <h3>{lang.youDescribe}: {this.props.location.name}</h3>
        {this.props.location.description}
        <h3>{lang.vocHelp}</h3>
        {this.props.location.vocHelp}

        <h3>{lang.locationOnMap}</h3>
        <div id="writeMap" style={{height: '200px'}}>
        </div>

        <br />
        <button>{lang.submit}</button>
      </div>
    )
  }
}
