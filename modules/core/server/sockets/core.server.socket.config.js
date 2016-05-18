'use strict';

// Create the core configuration
module.exports = function (io, socket) {
  io.emit('userUpdate', {
    recipients: '*',
    op: 'newConnection'
  });
  // Send a message to all connected sockets when a message is received
  socket.on('newTeam', function (message) {
    io.emit('newTeam', message);
  });
  socket.on('deleteTeam', function (message) {
    io.emit('deleteTeam', message);
  });
  socket.on('insertRequest', function (message) {
    io.emit('insertRequest', message);
  });
  socket.on('declineUser', function (message) {
    io.emit('declineUser', message);
  });
  socket.on('acceptUser', function (message) {
    io.emit('acceptUser', message);
  });
  socket.on('teamUpdate', function (message) {
    io.emit('teamUpdate', message);
  });
};
