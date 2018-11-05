import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../shared/product.service';
import {SocketService} from '../../../shared/socket.service';
import {ChatListResponse} from '../../../interfaces/chat-list-response';
import {User} from '../../../interfaces/user';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls:['./list-user.component.scss']
})
export class ListUserComponent implements OnInit{
  @Output() userClicked = new EventEmitter<any>();
  @Output() allUsers = new EventEmitter<any>();
  @Output() changedUserStatus = new EventEmitter<any>();
  loginUserInfo:any;
  chatListUsers: User[] = [];
  chatListEvent$:any;
  loading:any;
  constructor(private router: Router,private route: ActivatedRoute,private productService: ProductService,
              private socketService:SocketService) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.loginUserInfo = JSON.parse(localStorage.getItem('user'));
    }
    this.chatListEvent$ = this.socketService.getChatList(this.loginUserInfo._id).subscribe((chatListResponse: ChatListResponse) => {
      this.renderChatList(chatListResponse);
    });
    }

    ngOnDestroy(){
     // this.chatListEvent$.unsubscribe();
   }

   renderChatList(chatListResponse: ChatListResponse): void {
     console.log("chatListResponse====>",chatListResponse);

    if (!chatListResponse.error) {
      if (chatListResponse.singleUser) {
        if (this.chatListUsers.length > 0) {
          this.chatListUsers = this.chatListUsers.filter(function (obj: User) {
            return obj.id !== chatListResponse.chatList[0].id;
          });
          }
        /* Adding new online user into chat list array */
        this.chatListUsers = this.chatListUsers.concat(chatListResponse.chatList);
      } else if (chatListResponse.userDisconnected) {
        const loggedOutUser = this.chatListUsers.findIndex((obj: User) => obj.id === chatListResponse.userid);
        if (loggedOutUser >= 0) {
          console.log("loggedOutUser====>",loggedOutUser);
          this.chatListUsers[loggedOutUser]['Online'] = 'N';
          console.log("here1");
          this.changedUserStatus.emit(this.chatListUsers);
          console.log("here2");
          }
      } else {
        /* Updating entire chatlist if user logs in. */
        this.chatListUsers = chatListResponse.chatList;
        }
      this.loading = false;
    } else {
      alert(`Unable to load Chat list, Redirecting to Login.`);
      // this.chatService.removeLS()
      //   .then(async (removedLs: boolean) => {
      //     await this.router.navigate(['/']);
      //     this.loading = false;
      //   })
    //     .catch(async (error: Error) => {
    //       alert(' This App is Broken, we are working on it. try after some time.');
    //       await this.router.navigate(['/']);
    //       console.warn(error);
    //       this.loading = false;
    //     });
     }
  }

  openChatPopUp(user: User): void {
    this.userClicked.emit(user);
  }
}
