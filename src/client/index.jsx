// getting the function that renders every thing and the socket to pass to it
import renderToPage from './renderToPage.jsx'
import {socket} from './redux.jsx'
// import App from './components/App'


// make webpack to magic with the styles
var style = require('./sass/main.sass')


console.log('fucking flamingo')

// setup the rendering
renderToPage(socket)
