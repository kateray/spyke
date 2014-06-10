var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ChatSchema = require('./chat.js')

var userSchema = new Schema({
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
