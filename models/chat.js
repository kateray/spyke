var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = require('./message.js')

var chatSchema = new Schema({
  messages: [MessageSchema],
  first: {type : Schema.ObjectId, ref : 'User'},
  second: {type : Schema.ObjectId, ref : 'User'}
})

module.exports = mongoose.model('Chat', chatSchema);
