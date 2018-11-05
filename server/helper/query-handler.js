const Auth = require('../models/auth.model');
const Chat = require('../models/chat.model');
const mongoose = require('mongoose');

class QueryHandle {
  constructor() {}

  getUserInfo({userId, socketId = false}) {
    let queryProjection = null;
    if (socketId) {
      queryProjection = {
        "SocketId": true
      }
    } else {
      queryProjection = {
        "UserName": true,
        "Online": true,
        '_id': false,
        'id': '$_id'
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        Auth.aggregate([{
          $match: {
            _id: mongoose.Types.ObjectId(userId)
          }
        }, {
          $project: queryProjection
        }
        ], (err, result) => {
          if (err) {
            reject(err);
          }
          socketId ? resolve(result[0]['SocketId']) : resolve(result);
        });
      } catch (error) {
        reject(error)
      }
    });
  }

  getChatList(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        Auth.aggregate([{
          $match: {
            '_id': {$ne:  mongoose.Types.ObjectId(userId)}
          }
        }, {
          $project: {
            "UserName": true,
            "Online": true,
            '_id': false,
            'id': '$_id'
          }
        }], (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } catch (error) {
        reject(error)
      }
    });
  }

  addSocketId({userId, socketId}) {
    return new Promise(async (resolve, reject) => {
      try {
        Auth.update({_id: userId}, {$set: {SocketId: socketId, Online: 'Y'}},(err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } catch (error) {
        reject(error)
      }
    });
  }


  insertMessages(msgObj) {
    let ChatObj = new Chat({
      UserName:msgObj.UserName,
      MsgFromUserId: msgObj.MsgFromUserId,
      MsgToUserId: msgObj.MsgToUserId,
      Message: msgObj.Message,
      CreatedAt: msgObj.CreatedAt
  });
    return new Promise((resolve, reject) => {
      ChatObj.save(ChatObj, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        });
      });
    }

  logout(userID,isSocketId){
    const data = {
      $set :{
        Online : 'N'
      }
    };
    return new Promise( async (resolve, reject) => {
      try {
        let condition = {};
        if (isSocketId) {
          condition.SocketId = userID;
        }else{
          condition._id = mongoose.Types.ObjectId(userID);
        }
        Auth.update( condition, data ,(err, result) => {
          if( err ){
            reject(err);
          }
          resolve(result);
        });
      } catch (error) {
        reject(error)
      }
    });
  }
}


module.exports = new QueryHandle();



