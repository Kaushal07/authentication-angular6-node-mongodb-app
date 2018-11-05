import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {RouteModule} from './app.route';
import {FormsModule} from '@angular/forms';
import {SharedModule} from './@shared/shared.module';
import {HeaderComponent} from './@shared/header/header.component';
import {SocketService} from './shared/socket.service';
import {ChatService} from './shared/chat.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    RouteModule,
    HttpClientModule
  ],
  providers: [SocketService,ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
