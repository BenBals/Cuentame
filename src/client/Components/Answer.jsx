// importing the react library
import React from 'react'

// getting the dynamic lang files
import lang from '../lang.jsx'
// get the function to render the map to the page
import renderMap from '../renderMap.jsx'

export default class Answer extends React.Component  {
    // stuff to do when the component was loaded
    componentDidMount() {
        // center: bogota
        const latLng = {
            lng: -74.075833,
            lat: 4.598056
        }

        // the default zoom level
        const zoom = 4

        // render with the given center, zoom and the ability to set markers on the #answerMap div
        renderMap(
            latLng,
            zoom,
            true,
            document.getElementById('answerMap')
        )
      }

    // the render function
    render() {
      return (
        <div>
          {/*the question*/}
          <h2>{lang.whereIsTheFollowingPlace}</h2>
          {/*the description by the other user*/}
          <div>{this.props.description}</div>
          {/*the element to render the map to*/}
          <div id='answerMap' style={{height: '50vh'}}></div>

          {/*the submit button*/}
          <button onClick={this.props.submitGuess}>{lang.submit}</button>
        </div>
      )
    }
}
