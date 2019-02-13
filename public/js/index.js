let socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New message received', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'me',
//   text: 'salut'
// }, function (data) { // acknowledgements
//   // this tells that message was received
//   console.log('Got it');
//   console.log(data);
// });

socket.on('newLocationMessage', function (message) {
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
  // event.cancelBubble = true;
  // event.returnValue = false;
  //
  // if (event.stopPropagation) {
  // 	event.stopPropagation();
  // 	event.preventDefault();
  // }

  let messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });

  return false;
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser!')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMassage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.')
  })
});
