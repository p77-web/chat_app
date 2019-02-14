let socket = io();

function scrollToBottom () {
  // selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');

  // heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  // console.log('Connected to server');
  let params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No errors');
    }
  });
});

socket.on('updateUserList', function(users) {
  // console.log('Users list', users);
  let ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
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
