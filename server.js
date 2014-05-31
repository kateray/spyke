var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(require('connect-assets')());

app.get("/", function(req, res) {
  return res.render('index', {
    title: 'Index'
  });
});

io.on('connection', function(socket){
  console.log('someone connected!');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('Listening on port 3000');
});
