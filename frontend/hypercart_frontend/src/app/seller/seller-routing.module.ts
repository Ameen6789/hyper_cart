import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { OrdersComponent } from './orders/orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { authGuard } from '../auth.gurad';
import { ListCategoryComponent } from './list-category/list-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';

const routes: Routes = [
  {path:'addproduct',component:AddProductComponent ,title:'Add Product',canActivate: [authGuard]},
  {path:'listproduct',component:ListProductComponent,title:'List Product',canActivate: [authGuard]},
  {path:'orders',component:OrdersComponent,title:'All Orders',canActivate: [authGuard]},
  {path:'editproduct',component:EditProductComponent,title:"Edit Product",canActivate: [authGuard]},
  {path:'addcategory',component:AddCategoryComponent,title:"Add Category",canActivate: [authGuard]},
  {path:'listcategory',component:ListCategoryComponent,title:"List Category",canActivate: [authGuard]},
  {path:'editcategory',component:EditCategoryComponent,title:"Edit Category",canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
