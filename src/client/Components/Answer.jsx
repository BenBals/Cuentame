import React from 'react'

import lang from '../lang.jsx'

export default class Answer extends React.Component  {
    componentDidMount() {
        console.log('the component did mount')
        const latLng = {lat: this.props.location.lat, lng: this.props.location.lng}

        renderMap(latLng, [{
            latLng: latLng
        }])
      }

    render() {
      return (
        <div>
          <h2>{lang.whereIsTheFollowingPlace}</h2>
          <div>{this.props.description}</div>
          <div id='answerMap'></div>
        </div>
      )
    }
}
