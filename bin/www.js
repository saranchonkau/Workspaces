#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('../app');
const debug = require('debug')('task1:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Socket.IO
 */
const socketIO = require('socket.io')(server);

const Workspace = require('../models/workspace');

socketIO.on('connection', (socket) => {
    console.log('a user connected, socketID: ', socket.id);
    socket.join(socket.handshake.query.roomName);

    socket.on('saveShape', (newShapeObject) => {
        console.log('New Shape: ', newShapeObject.classname);
        console.log('Room ID: ', newShapeObject.id);
        console.log('Snapshot:  ', newShapeObject.snapshot);
        Workspace.findByIdAndUpdate(newShapeObject.id, {snapshot: newShapeObject.snapshot}, function () {
            console.log('Updated!!!');
        });
        socket.broadcast.to(newShapeObject.id).emit(newShapeObject.classname, {
            shape: newShapeObject.shape,
            previousShapeId: newShapeObject.previousShapeId,
            classname: newShapeObject.classname
        });
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    console.log('Listening on *:3000');
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
