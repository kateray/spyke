window.onload = function() {
  var socket = io();

  var addMessage = function(msg){
    $('#messages').append($('<li>').text(msg));
  }

  socket.on('connect', function(){
    socket.emit('join', window.author, window.chat);
  })

  socket.on('announcement', addMessage)

  $('#new-message-form').submit(function(){
    var msg = $('#message-content').val();
    socket.emit('chat message', msg);
    $('#message-content').val('');
    addMessage('me: ' + msg);
    return false;
  });

  socket.on('chat message', function(from, text){
    addMessage(from + ': ' + text);
  });
}
