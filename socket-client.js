let cx = null;

module.exports = {
  initConnection: (httpServer) => {
    cx = require('socket.io')(httpServer);
    console.log('created socket connection');
    cx.on('connection', (socket) => {
      console.log('user connected via socket');
      socket.on('disconnect', () => console.log('user disonnected from socket'))
    })
  },
  getConnection: () => cx
}
