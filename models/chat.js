var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = require('./message.js');

var chatSchema = new Schema({
  messages: [MessageSchema],
  users: [{type : Schema.ObjectId, ref : 'User'}]
})

module.exports = mongoose.model('Chat', chatSchema);
