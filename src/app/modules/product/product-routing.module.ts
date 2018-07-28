import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddEditProductComponent} from './add-edit-product/add-edit-product.component';
import {ListProductComponent} from './list-product/list-product.component';
import {DataResolve} from '../../@shared/services/data.resolve';

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: "list"
  },
  {
    path: 'add',
    component: AddEditProductComponent
  },
  {
    path: 'list',
    component: ListProductComponent,
    data: { apiPath: 'http://localhost:5000/products/getProducts'},
    resolve: { products : DataResolve },
  },
  {
    path: 'edit/:id',
    component: AddEditProductComponent,
    data: { apiPath: 'http://localhost:5000/products/singleProduct/:id'},
    resolve: { product : DataResolve },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
