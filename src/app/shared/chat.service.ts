import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {map} from 'rxjs/operators';
import {apiUrl} from './constant';
import {Headers, RequestOptions} from '@angular/http';
import {isObjectFlagSet} from 'tslint';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChatService {
  http: any;
  authToken:any;
  options;

  constructor(private Http:HttpClient){
    this.http = Http;
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  createAuthenticationHeaders() {
    this.loadToken();
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }
  getDatabaseMessages(ids){
    this.createAuthenticationHeaders(); // Create headers before sending to API
    let searchUrl = `${apiUrl}/chat-messages?msgFromId=${ids.userId}&msgToId=${ids.toUserId}`;
    return this.http.get(searchUrl, this.options).pipe(map((response: any) => response.data));
  }

  removeLS(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

}
