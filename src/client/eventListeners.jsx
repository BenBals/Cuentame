// the function that handels all socket events and dispatching them to the store
export default (socket, store) => {

  // getting new player data from the server
  socket.on('update players', (newPlayers) => {
      console.log('i got new players');

      const isStillIn = () => {
          store.getState().players.reduce((acc, player) => {
              return player.name === store.getState().name ? true : acc;
          }, false);
      };

      store.dispatch({
          type: 'UPDATE_PLAYERS',
          newPlayers: newPlayers
      });

      if (!isStillIn() && store.getState().status === 'PLAYING') {
          window.location.reload();
      }
  });

  // getting all the data thats needed to do the set up
  socket.on('initial data', (initialData) => {
    store.dispatch({
      type: 'SET_INITIAL_DATA',
      data: initialData
    })
  })

  // starting a new round
  socket.on('start new round', (data) => {
    store.dispatch({
      type: 'START_NEW_ROUND',
      data: data
    })
  })

  // getting the description of the writer
  socket.on('user description', (description) => {
    store.dispatch({
      type: 'SUBMITTED_USER_DESCRIPTION',
      description: description
    })
  })

  // getting the round results
  socket.on('round results', (results) => {
    store.dispatch({
      type:'CHANGE_SCREEN',
      target: 'ROUND_RESULTS'
    })
  })

  // the games are over!
  socket.on('end game', (players) => {
    store.dispatch({
      type: 'END_GAME', 
      players: players
    })
  })

  // reloading when reset
  socket.on('reset', () => {
    window.location.reload()
  })
}
