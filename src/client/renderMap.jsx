export default (latLng, markers) => {
  const map = new google.maps.Map(document.getElementById('writeMap'), {
    center: latLng,
    zoom: 8
  })

  markers.map((marker) => {
    const thisMarker = new google.maps.Marker({
      position: marker.latLng,
      title: "Hello World!"
    })

    thisMarker.setMap(map)
  })

  window.currentMap = map
}
