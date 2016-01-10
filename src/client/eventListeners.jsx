export default (socket, store) => {

  socket.on('INCREMENT', () => {
    store.dispatch({type: 'INCREMENT'})
  })

}
