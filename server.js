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
});

http.listen(3000, function(){
  console.log('Listening on port 3000');
});
