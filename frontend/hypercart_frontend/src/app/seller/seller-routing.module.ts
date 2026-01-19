import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { OrdersComponent } from './orders/orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CommonModule } from '@angular/common';
CommonModule
const routes: Routes = [
  {path:'addproduct',component:AddProductComponent ,title:'Add Product'},
  {path:'listproduct',component:ListProductComponent,title:'List Product'},
  {path:'orders',component:OrdersComponent,title:'All Orders'},
  {path:'edit-product',component:EditProductComponent,title:"Edit Product"}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
