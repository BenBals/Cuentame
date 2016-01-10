var socket = io() // being injected through the script tag

import renderToPage from './renderToPage.jsx'
// import App from './components/App'

// setup the rendering
renderToPage(socket)
