window.onload = function() {
  var socket = io();

  socket.on('connect', function(){
    //TODO: DO NOT GET INFO FROM DOM
    name = $('#username').text();
    socket.emit('join', name);
  })

  socket.on('announcement', function(msg){
    $('#messages').append($('<li>').text(msg));
  })
  $('#new-message-form').submit(function(){
    socket.emit('chat message', $('#new-message').val());
    $('#new-message').val('');
    return false;
  });
  socket.on('chat message', function(from, text){
    $('#messages').append($('<li>').text(from + ': ' + text));
  });

}
