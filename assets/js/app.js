var socket = io();
$('#new-message-form').submit(function(){
  socket.emit('chat message', $('#new-message').val());
  $('#new-message').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
