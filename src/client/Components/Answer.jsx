import React from 'react'

import lang from '../lang.jsx'
import renderMap from '../renderMap.jsx'

export default class Answer extends React.Component  {
    componentDidMount() {
        const lngLat = {
            lng: -74.075833,
            lat: 4.598056
        }

        const zoom = 4

        renderMap(
            lngLat,
            zoom,
            true,
            document.getElementById('answerMap')
        )
      }

    render() {
      return (
        <div>
          <h2>{lang.whereIsTheFollowingPlace}</h2>
          <div>{this.props.description}</div>
          <div id='answerMap' style={{height: '200px'}}></div>
        </div>
      )
    }
}
