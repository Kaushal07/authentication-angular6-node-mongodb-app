'use strict';
const mongoose = require('mongoose');

const UserModel = function() {
    const userSchema = mongoose.Schema({
        UserName:String,
        Email : String,
        Password : String,
        Online:String,
        SocketId:String
    });
    return mongoose.model('RegisteredUsers', userSchema);
};

module.exports = new UserModel();
