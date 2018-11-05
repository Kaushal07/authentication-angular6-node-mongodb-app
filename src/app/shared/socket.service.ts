import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {map} from 'rxjs/operators';
import {apiUrl} from './constant';
import {Headers, RequestOptions} from '@angular/http';
import {isObjectFlagSet} from 'tslint';
/* importing interfaces starts */
import { Auth } from './../interfaces/auth';
import { ChatListResponse } from './../interfaces/chat-list-response';
import { MessageSocketEvent } from './../interfaces/message-socket-event';
import { Message } from './../interfaces/message';
/* importing interfaces ends */


@Injectable()
export class SocketService {
  private url = apiUrl;
  private socket;

  connectSocket(userId:string):void{
    this.socket = io(apiUrl,{query: `userId=${userId}`});
  }

  /*
  * Method to emit the add-messages event.
  */
  sendMessage(message: Message): void {
    this.socket = io(apiUrl);
    this.socket.emit('add-message', message);
  }


  /*
   * Method to receive add-message-response event.
   */
  receiveMessages(): Observable<Message> {
    return new Observable(observer => {
      this.socket.on('add-message-response', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  /*
   * Method to emit the logout event.
   */
  logout(userId: { userId: string}): Observable<Auth> {
    this.socket = io(apiUrl);
    this.socket.emit('logout', userId);
    return new Observable(observer => {
      this.socket.on('logout-response', (data: Auth) => {
        console.log("data====>",data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
    /*
* Method to receive chat-list-response event.
*/
  getChatList(userId: string = null): Observable<ChatListResponse> {
    this.socket = io(this.url);
    if (userId !== null) {
      this.socket.emit('chat-list', { userId: userId });
    }
    return new Observable(observer => {
      this.socket.on('chat-list-response', (data: ChatListResponse) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
