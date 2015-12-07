'use strict';

// Create the core configuration
module.exports = function (io, socket) {
  io.emit('userUpdate', {
    recipients: '*',
    op: 'newConnection'
  });

  // Send a message to all connected sockets when a message is received
  socket.on('userUpdate', function (message) {
    // Emit the 'userUpdate' event
    io.emit('userUpdate', message);
  });
  // Send a message to all connected sockets when a message is received
  socket.on('teamUpdate', function (message) {
    // Emit the 'userUpdate' event
    io.emit('teamUpdate', message);
  });
};
