'use strict';

const path = require('path');
const queryHandler = require('../helper/query-handler');

class Socket{

  constructor(socket){
    this.io = socket;
  }

  socketEvents(){
    this.io.on('connection', (socket) => {
      /* Get the user's Chat list	*/
      socket.on('chat-list', async (data) => {
        if (data.userId == '') {
          this.io.emit(`chat-list-response`, {
            error : true,
            message : 'User not found.'
          });
        }else{
          try {
            const [UserInfoResponse, chatlistResponse] = await Promise.all([
              queryHandler.getUserInfo( {
                userId: data.userId,
                socketId: false
              }),
              queryHandler.getChatList(data.userId)
            ]);

            this.io.to(socket.id).emit(`chat-list-response`, {
              error : false,
              singleUser : false,
              chatList : chatlistResponse
            });

            socket.broadcast.emit(`chat-list-response`,{
              error : false,
              singleUser : true,
              chatList : UserInfoResponse
            });
          } catch ( error ) {
            this.io.to(socket.id).emit(`chat-list-response`,{
              error : true ,
              chatList : []
            });
          }
        }
      });

      /**
       * send the messages to the user
       */
      socket.on('add-message', async (data) => {
        delete data.tempDisplayDate;
        if (data.Message === '') {
          this.io.to(socket.id).emit('add-message-response',{
            error : true,
            message: 'Message not found.'
          });
        }else if(data.MsgFromUserId === ''){
          this.io.to(socket.id).emit('add-message-response',{
            error : true,
            message: 'Something bad happend.'
          });
        }else if(data.MsgToUserId === ''){
          this.io.to(socket.id).emit('add-message-response',{
            error : true,
            message: 'Select a user to chat.'
          });
        }else{
          try{
            const [toSocketId, messageResult ] = await Promise.all([
              queryHandler.getUserInfo({
                userId: data.MsgToUserId,
                socketId: true
              }),
              queryHandler.insertMessages(data)
            ]);
            socket.broadcast.to(toSocketId).emit('add-message-response', data);
            } catch (error) {
            this.io.to(socket.id).emit('add-message-response',{
              error : true,
              message : 'Could not store messages, server error.'
            });
          }
        }
      });

      /**
       * Logout the user
       */
      socket.on('logout', async (data)=>{
        const userId = data.userId;
        try{
          await queryHandler.logout(userId);
          this.io.to(socket.id).emit(`logout-response`,{
            error : false,
            message: 'User is not logged in.',
            userId: userId
          });

          socket.broadcast.emit(`chat-list-response`,{
            error : false ,
            userDisconnected : true ,
            userid : userId
          });
        } catch (error) {
          this.io.to(socket.id).emit(`logout-response`,{
            error : true,
            message: 'Something bad happend. It\'s not you, it\'s me.',
            userId: userId
          });
        }
      });


      /**
       * sending the disconnected user to all socket users.
       */
      socket.on('disconnect',async () => {
        socket.broadcast.emit(`chat-list-response`,{
          error : false ,
          userDisconnected : true ,
          userid : socket.request._query['userId']
        });

      });

    });

  }

  socketConfig(){
    this.io.use( async (socket, next) => {
      try {
        console.log(`Socket ${socket.id} connected.`);
        await queryHandler.addSocketId({
          userId: socket.request._query['userId'],
          socketId: socket.id
        });
        next();
      } catch (error) {
        // Error
        // console.error(error);
      }
    });

    this.socketEvents();
  }
}
module.exports = Socket;
