var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser')

var users = require('./users');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(require('connect-assets')());
app.use(cookieParser());
app.use(bodyParser());

app.use(session({
    secret: 'keyboard cat'
}))

var router = express.Router();

router.use(function(req, res, next) {
  if (!req.session.logged_in) {
    res.redirect( '/login' );
  } else {
    next();
  }
});

app.use('/chats', router);

app.post('/login', function(req, res){
  if (!users[req.body.user] || req.body.password != users[req.body.user].password){
    res.end('Bad username/password');
  } else {
    req.session.logged_in = true;
    console.log(req.session.logged_in);
    req.session.name = users[req.body.user].name;
    res.redirect( '/chats' );
  }
})

app.get('/', function(req, res){
  res.render( 'home' );
});


app.get( '/login', function( req, res ) {
	res.render( 'login' );
});

app.get( '/logout', function( req, res) {
  req.session.logged_in = false;
  res.redirect( '/' );
})

app.get('/chats', function(req, res){
  res.render( 'index' );
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

var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('Listening on port 3000');
});
