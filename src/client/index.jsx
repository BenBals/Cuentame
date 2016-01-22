// getting the function that renders every thing and the socket to pass to it
import renderToPage from './renderToPage.jsx'
import {socket} from './redux.jsx'
// import App from './components/App'


// make webpack to magic with the styles
var style = require('./sass/main.sass')


console.log('horny HANS')

// setup the rendering
renderToPage(socket)


    window.cheat = () => {
        window.store.dispatch({
            type: 'PLACE_MARKER',
            latLng: {
                lat: () => window.store.getState().location.lat,
                lng: () => window.store.getState().location.lng + 0.00000001
            }
        })
    }
