const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} =require('./utils/users');

let app = express();

const publicPath = path.join(__dirname, '../public');

let port = process.env.PORT || 3060;

app.use(express.static(publicPath));

// to use socket.io
let server = http.createServer(app);
let io = socketIO(server);

let users = new Users();

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit emits an event to a single connection
  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  //
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required!');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create message', message);
    // io.emit emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    // this is the function in the emitter - see index.js here

    // callback('This is from the server');
    callback();
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
    // console.log('User was disconnected');
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Chat app is running on port ${port}`);
});
