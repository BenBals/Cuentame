import { store } from './redux.jsx'

export default (latLng, zoom, addNewMarkers, renderTarget, markers) => {
  var allMarkers = []

  const placeMakerAndPanTo = (latLng, map) => {
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: map
    })

    for (var i = 0; i < allMarkers.length; i++ ) {
      allMarkers[i].setMap(null);
    }
    allMarkers.length = 0;

    allMarkers.push(newMarker)

    map.panTo(latLng)
  }

  const map = new google.maps.Map(renderTarget, {
    center: latLng,
    zoom: zoom
  })

  if (addNewMarkers) {
    map.addListener('click', (e) => {
      console.log(e)
      store.dispatch({
        type: 'PLACE_MARKER',
        latLng: e.latLng
      })
      placeMakerAndPanTo(store.getState().marker.latLng, map)
    })
  }

  markers.map((marker) => {
    const thisMarker = new google.maps.Marker({
      position: marker.latLng,
      title: "Hello World!"
    })

    allMarkers.push(thisMarker)

    thisMarker.setMap(map)
  })

  window.currentMap = map
}
