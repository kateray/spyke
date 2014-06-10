var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  author: {type : Schema.ObjectId, ref : 'User'},
  chat: {type: Schema.ObjectId, ref: 'Chat'},
  content: String,
  date: Date
});

module.exports = mongoose.model('Message', messageSchema);
