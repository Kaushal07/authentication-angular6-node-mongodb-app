import {  NgModule } from '@angular/core';
import {AddEditProductComponent} from './add-edit-product/add-edit-product.component';
import {ListProductComponent} from './list-product/list-product.component';
import {ProductRoutingModule} from './product-routing.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProductService} from './shared/product.service';
import {DataResolve} from '../../@shared/services/data.resolve';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ListUserComponent} from './list-user/list-user.component';
import {ChatService} from '../../shared/chat.service';

@NgModule({
  imports: [
    ProductRoutingModule,
    FormsModule,
    CommonModule,
    NgbModule
  ],
  declarations: [
    AddEditProductComponent,
    ListProductComponent,
    ListUserComponent
  ],
  providers:[ProductService,DataResolve]
})
export class ProductModule {}
