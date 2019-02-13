const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

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

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('Create message', message);
    // io.emit emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    // this is the function in the emitter - see index.js here
    callback('This is from the server');
    // socket.broadcast.emit emits an event but except here
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMassage', (coords) => {
    // console.log(`Lat: ${coords.latitude}, long: ${coords.longitude}`);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Chat app is running on port ${port}`);
});
