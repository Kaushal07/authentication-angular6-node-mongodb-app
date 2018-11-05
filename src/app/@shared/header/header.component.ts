import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../modules/auth/shared/auth.service';
import {ChatService} from '../../shared/chat.service';
import {SocketService} from '../../shared/socket.service';
import {Auth} from '../../interfaces/auth';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  loginUserInfo:any;
    constructor(
        public authService: AuthService,
        private router: Router,
        private chatService : ChatService,
        private socketService : SocketService
    ) {}

  ngOnInit() {}

    logout() {
      this.loginUserInfo = JSON.parse(localStorage.getItem('user'));
      this.chatService.removeLS()
      .then((removedLs: boolean) => {
        this.socketService.logout({ userId: this.loginUserInfo._id}).subscribe((response: Auth) => {
          this.router.navigate(['/']);
        });
      })
      .catch((error: Error) => {
        alert(' This App is Broken, we are working on it. try after some time.');
        throw error;
      });
  }



}
