export default (lngLat, zoom, addNewMarkers, renderTarget, markers) => {
  var allMarkers = []

  const placeMakerAndPanTo = (lngLat, map) => {
    const newMarker = new google.maps.Marker({
      position: lngLat,
      map: map
    })

    for (var i = 0; i < allMarkers.length; i++ ) {
      allMarkers[i].setMap(null);
    }
    allMarkers.length = 0;

    allMarkers.push(newMarker)

    map.panTo(lngLat)
  }

  const map = new google.maps.Map(renderTarget, {
    center: lngLat,
    zoom: zoom
  })

  if (addNewMarkers) {
    map.addListener('click', (e) => {
      console.log(e)
    })
  }

  markers.map((marker) => {
    const thisMarker = new google.maps.Marker({
      position: marker.lngLat,
      title: "Hello World!"
    })

    allMarkers.push(thisMarker)

    thisMarker.setMap(map)
  })

  window.currentMap = map
}
