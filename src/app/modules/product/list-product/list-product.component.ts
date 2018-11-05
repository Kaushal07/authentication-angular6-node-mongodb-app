import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {ProductService} from '../shared/product.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from '../../../shared/socket.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ChatService} from '../../../shared/chat.service';
import {Message} from '../../../interfaces/message';
declare const $;
@Component({
  selector: 'list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  productList:any;
  isProducts:any;
  loginUserInfo:any;
  chatPopup:any;
  userListingPopup:any;
  Message:any;
  public messages: Message[] = [];
  SelectedUserForChat:any;
  public messageLoading = true;
  @ViewChild('chat') chatWindow: any;
  @ViewChild('userList') userListingWindow:any;
  constructor(private router: Router, private http: Http, private route: ActivatedRoute, private productService: ProductService,
              private modalService: NgbModal,private socketService: SocketService,
              private chatService: ChatService,private el :ElementRef) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.loginUserInfo = JSON.parse(localStorage.getItem('user'));
    }
    this.establishedSocketConnection();
    this.listenForMessages();
    this.productService.getAllProducts(this.loginUserInfo._id)
      .subscribe((res) => {
        this.productList = res;
        this.checkProductListLength();
        }, (e) => {
      });

    }

  listenForMessages(): void {
    console.log("in listen for messages");
    this.socketService.receiveMessages().subscribe((socketResponse:Message) => {
      this.convertMsgTime(socketResponse);
      if (this.SelectedUserForChat !== null && this.SelectedUserForChat.id === socketResponse.MsgFromUserId) {
        this.messages = [...this.messages, socketResponse];
        this.scrollMessageContainer();
      }
    },(error)=>{
    })
  }

  establishedSocketConnection(){
    try {
      if (this.loginUserInfo._id === '' || typeof this.loginUserInfo._id === 'undefined' || this.loginUserInfo._id === null) {
        alert('Something went wrong');
      } else {
        /* making socket connection by passing UserId. */
        this.socketService.connectSocket(this.loginUserInfo._id);
        }
    } catch (error) {
      alert('Something went wrong');
    }
  }

  ngOnDestroy() {
      // this.receivedMsgEvent$.unsubscribe();
    }

  Delete(id){
    this.productService.deleteProductById(this.loginUserInfo._id, id).subscribe((res)=>{
          this.getProductList();
    },(e)=>{
      })
  }

  checkProductListLength(){
    if(this.productList.length){
      this.isProducts = true
    }else{
      this.isProducts = false;
    }
  }

  getProductList(){
    this.productService.getAllProducts(this.loginUserInfo._id).subscribe((res)=>{
      this.productList = res;
      this.checkProductListLength();
    },(e)=>{

    })
  }

  openUserListingPopup(){
    this.userListingPopup = this.modalService.open(this.userListingWindow, {windowClass: 'dark-modal', backdrop: 'static'});
    }

    userSelected(userObj){
    this.scrollMessageContainer();
    this.SelectedUserForChat = userObj;
    this.userListingPopup.close();
    this.chatPopup = this.modalService.open(this.chatWindow, {windowClass: 'dark-modal', backdrop: 'static'});
    this.messageLoading = true;
    this.chatService.getDatabaseMessages({ userId: this.loginUserInfo._id, toUserId: this.SelectedUserForChat.id}).subscribe((response) => {
      this.messages = response;
      this.convertMsgTime(this.messages);
      this.messageLoading =  false;
    });
    }

  userStatusChangeEvent(event){
    console.log("here2");
    console.log("this.SelectedUserForChat====>",this.SelectedUserForChat);
    console.log("event====>",event);

  }
  sendMessage(event) {
      const message = this.Message.trim();
      if (message === '' || message === undefined || message === null) {
        alert(`Message can't be empty.`);
      } else {
        let chatObj = {
          UserName: this.loginUserInfo.UserName,
          MsgFromUserId: this.loginUserInfo._id,
          Message: message,
          MsgToUserId: this.SelectedUserForChat.id,
          CreatedAt:new Date()
        };
        this.sendAndUpdateMessages(chatObj);
      }
  }

  sendAndUpdateMessages(message: Message) {
    try {
      this.socketService.sendMessage(message);
      this.convertMsgTime(message);
      this.messages = [...this.messages, message];
      this.Message = '';
      this.scrollMessageContainer();
    } catch (error) {
      console.warn(error);
      alert(`Can't send your message`);
    }
  }

  convertMsgTime(msgs) {
     if (!_.isEmpty(msgs)) {
       msgs = _.isArray(msgs) ? msgs : [msgs];
       _.forEach(msgs, (msg) => {
         msg.tempDisplayDate = moment(msg.CreatedAt).format('DD-MM-YYYY hh:mm:ss');
       });
     }
   }

   chatPopupClose(){
   this.chatPopup.close();
   this.messages = [];
  }


  scrollMessageContainer(): void {
      try {
       setTimeout(()=>{
           $('div.panel-body').animate({scrollTop: $('.panel-body ul').height()}, 500);
      },500);
      } catch (error) {
        console.warn(error);
      }
    }

    alignMessage(userId: string): boolean {
    return this.loginUserInfo._id === userId ? false : true;
  }

  backToUserListPopup(){
    this.chatPopup.close();
    this.openUserListingPopup();
    }

}
