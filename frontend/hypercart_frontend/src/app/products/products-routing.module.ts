import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { ViewproductComponent } from './viewproduct/viewproduct.component';
import { AllProductsComponent } from './all-products/all-products.component';

const routes: Routes = [
  {path:'home',component:ProductsHomeComponent,title:'HyperCart'},
  {path:'viewproduct',component:ViewproductComponent,title:'View Product'},
  {path:'all_products',component:AllProductsComponent,title:'All Product'},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
