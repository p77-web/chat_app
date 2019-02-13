let socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  // using templates
  let formattedTime = moment(message.createdAt).format('h:mm:ss a');
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);

  // before using mustache.js
  // // console.log('New message received', message);
  // let formattedTime = moment(message.createdAt).format('h:mm:ss a');
  // let li = jQuery('<li></li>');
  // li.text(`${message.from} @${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
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
  let formattedTime = moment(message.createdAt).format('h:mm:ss a');
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  jQuery('#messages').append(html);
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
