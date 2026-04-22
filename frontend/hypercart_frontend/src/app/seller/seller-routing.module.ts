import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { OrdersComponent } from './orders/orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { authGuard } from '../auth.gurad';

const routes: Routes = [
  {path:'addproduct',component:AddProductComponent ,title:'Add Product',canActivate: [authGuard]},
  {path:'listproduct',component:ListProductComponent,title:'List Product',canActivate: [authGuard]},
  {path:'orders',component:OrdersComponent,title:'All Orders',canActivate: [authGuard]},
  {path:'edit-product',component:EditProductComponent,title:"Edit Product",canActivate: [authGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
