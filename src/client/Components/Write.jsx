// react lib
import React from 'react'

// process markdown
import marked from 'marked'

// lang files
import lang from '../lang.jsx'
// the func to render the map to the screen
import renderMap from '../renderMap.jsx'

export default class Write extends React.Component {
  // what to do when the component was rendered
  componentDidMount() {
    // process the lat and lng in to a maps readable format
    const latLng = {lat: this.props.location.lat, lng: this.props.location.lng}
    // the zoom level
    const zoom = 8
    // and render it with the right latLng, the zoom level, no ability to make new markers, the mount and the marker
    renderMap(
      latLng,
      zoom,
      false,
      document.getElementById('writeMap'),
      [{latLng: latLng}]
    )
  }

  // render stuff
  render () {
    // the function that handels the submit
    const handleSubmit = () => {
      // use the ref and the prop
      this.props.submitDescription(this.text.value)
    }

    const getVocHelp = () => {
      return this.props.location.vocHelp !== '' ? (
        <div>
          <h3>{lang.vocHelp}</h3>
          <div dangerouslySetInnerHTML={{__html: marked(this.props.location.vocHelp)}}></div>
        </div>
        ) : null
    }

    return (
      <div>
        {/* tell them that they are the writer */}
        <h2>{lang.youAreTheWriter}</h2>
        {/* the textarea with the ref*/}
        <textarea defaultValue={lang.yourDescriptionHere} ref={(ref) => this.text = ref}></textarea>
        {/* tell them what they need to describe*/}
        <h3>{lang.youDescribe}: {this.props.location.name}</h3>
        {/* german description*/}
        <div dangerouslySetInnerHTML={{__html: marked(this.props.location.description)}}>
        </div>
        {/* voc help*/}
        {getVocHelp()}

        {/* the map */}
        <h3>{lang.locationOnMap}</h3>
        <div id="writeMap" style={{height: '25vh'}}>
        </div>

        <br />
        {/* the submit button*/}
        <a className="waves-effect waves-light btn" onClick={handleSubmit}>{lang.submit}</a>
      </div>
    )
  }
}
