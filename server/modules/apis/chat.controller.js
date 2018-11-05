const ChatModel = require('../../models/chat.model');

class ChatController {
  constructor(app){
     app.get('/chat-messages',this.getUserMessages)
  }

  getUserMessages(req,res){
    let toUserId = req.query.msgToId;
    let userId = req.query.msgFromId;
    ChatModel.find({
      '$or' : [
      { '$and': [
          {
            'MsgFromUserId': userId
          },{
            'MsgToUserId': toUserId
          }
        ]
      },{
        '$and': [
          {
            'MsgToUserId': userId
          }, {
            'MsgFromUserId': toUserId
          }
        ]
      },
    ]})
      .then((msgs) => {
        if (msgs.length) {
          return res.send({success: false, data: msgs});
        }
        return res.send({success: true, data: []});
      })
      .catch((e)=>{
        res.send({success: false, Error: e, message: "Error while getting messages."});
      })
  }
}

module.exports = ChatController;




