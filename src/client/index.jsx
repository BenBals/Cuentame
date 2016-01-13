// getting the function that renders every thing and the socket to pass to it
import renderToPage from './renderToPage.jsx'
import {socket} from './redux.jsx'
// import App from './components/App'

import style from './materialize/main.sass'


// setup the rendering
renderToPage(socket)
