'use strict';
const mongoose = require('mongoose');

const chatModel = function() {
  const chatSchema = mongoose.Schema({
    UserName:String,
    MsgFromUserId:String,
    MsgToUserId:String,
    Message : String,
    CreatedAt: Date
  });

  return mongoose.model('chat', chatSchema);
};

module.exports = new chatModel();
