export default (socket, store) => {

  socket.on('INCREMENT', () => {
    store.dispatch({type: 'INCREMENT'})
  })

  socket.on('update players', (newPlayers) => {
    store.dispatch({
      type: 'UPDATE_PLAYERS',
      newPlayers: newPlayers
    })
  })

  socket.on('initial data', (initialData) => {
    store.dispatch({
      type: 'SET_INITIAL_DATA',
      data: initialData
    })
  })

  socket.on('start new round', (data) => {
    console.log(data)
    store.dispatch({
      type: 'START_NEW_ROUND',
      data: data
    })
  })

}
