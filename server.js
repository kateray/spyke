var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(require('connect-assets')());
app.use(cookieParser());
app.use(bodyParser());

app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
var Chat = require('./models/chat');
var Message = require('./models/message');


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var router = express.Router();

router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect( '/login' );
  } else {
    next();
  }
});

app.use('/chats', router);

sessionVariables = function(req, res, next) {
  res.locals.session = req.session;
  next();
};

app.get('*', sessionVariables);

app.post('/login', passport.authenticate('local', {
  successRedirect: '/chats',
  failureRedirect: '/'
  })
);

app.post('/signup', function(req, res){
  User.register(new User({ username : req.body.username, email : req.body.email }), req.body.password, function(err, user) {
    if (err) {
      return console.error(err);
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/chats');
    });
  });
})

app.get('/', function(req, res){
  res.render( 'home' );
});


app.get( '/login', function( req, res ) {
	res.render( 'login' );
});

app.get( '/signup', function( req, res ) {
  res.render( 'signup', { });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/chats', function(req, res){
  res.render( 'index', { user : req.user });
});

app.get('/chats/:username', function(req, res){
  User.findOne({ username: req.params.username }, function (err, partner){
    var userID = mongoose.Types.ObjectId(req.user.id);
    var partnerID = mongoose.Types.ObjectId(partner.id);
    Chat.findOne({
      $or: [
        { $and: [{first: userID}, {second: partnerID}]},
        { $and: [{first: partnerID}, {second: userID}]}
      ]
    }, function(err, chat) {
      if (err) {
        return console.error(err);
      }
      if (chat){
        console.log(chat.id);
        res.render( 'chat', { user : req.user, partner: partner, chat: chat });
      }
      if (!chat) {
        var chat = new Chat({first: req.user.id, second: partner.id});
        chat.save(function (err) {
          console.log(chat.id);
          res.render( 'chat', { user : req.user, partner: partner, chat: chat });
        })
      }
    });



    // Chat.where('users').in([req.user.username, partner.username]).exec(function(err, chat){
    //   if (!chat) {
    //     var chat = new Chat({ users: [req.user.id, partner.id] });
    //   }
    //   console.log(chat.id);
    //   res.render( 'chat', { user : req.user, partner: partner });
    // })

  });
});

io.on('connection', function(socket){
  socket.on('join', function(author, chat){
    socket.broadcast.emit('announcement', name + ' joined the chat.');
  })
  socket.on('disconnect', function(){
    socket.broadcast.emit('announcement', socket.nickname + ' left the chat.');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', socket.nickname, msg);
  });
});

mongoose.connect('mongodb://localhost/test');
var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('Listening on port 3000');
});
