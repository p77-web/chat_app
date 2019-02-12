const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let app = express();

const publicPath = path.join(__dirname, '../public');

let port = process.env.PORT || 3060;

app.use(express.static(publicPath));

// to use socket.io
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Ioana',
    text: 'Sup',
    createdAt: 15478965
  });

  socket.on('createMessage', (message) => {
    console.log('Create message', message);
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Chat app is running on port ${port}`);
});
