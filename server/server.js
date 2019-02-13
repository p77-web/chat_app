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

  // socket.emit emits an event to a single connection

  socket.on('createMessage', (message) => {
    console.log('Create message', message);
    // io.emit emits an event to every single connection
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Chat app is running on port ${port}`);
});
