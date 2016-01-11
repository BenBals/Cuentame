// getting the store
import { store } from './redux.jsx'

export default (latLng, zoom, addNewMarkers, renderTarget, markers) => {
  // keep track of all markers
  var allMarkers = []

  // place a marker on latLng and render it to the map map
  const placeMakerAndPanTo = (latLng, map) => {
    // create the marker and render it
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: map
    })

    // remove all other markers
    for (var i = 0; i < allMarkers.length; i++ ) {
      allMarkers[i].setMap(null);
    }
    // delete them from the array
    allMarkers.length = 0;

    // push the new marker onto the array
    allMarkers.push(newMarker)

    // pan to the latLng of the marker
    map.panTo(latLng)
  }

  // create the map with the given latLng and zoom
  const map = new google.maps.Map(renderTarget, {
    center: latLng,
    zoom: zoom
  })

  // if there is the ability to set markers set up the event listeners
  if (addNewMarkers) {
    // do all the event stuff
    map.addListener('click', (e) => {
      // pass all the stuff to the store
      store.dispatch({
        type: 'PLACE_MARKER',
        latLng: e.latLng
      })
      // do the heavy-lifting
      placeMakerAndPanTo(store.getState().marker.latLng, map)
    })
  }

  // place all of the markers in the passed markers array
  markers.map((marker) => {
    // create the markers
    const thisMarker = new google.maps.Marker({
      position: marker.latLng,
      title: "Hello World!"
    })

    // push them into the array
    allMarkers.push(thisMarker)

    // put it onto the map
    thisMarker.setMap(map)
  })

  window.currentMap = map
}
