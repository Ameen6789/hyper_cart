import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { ViewproductComponent } from './viewproduct/viewproduct.component';
import { AllProductsComponent } from './all-products/all-products.component';


@NgModule({
  declarations: [
    ProductsHomeComponent,
    ViewproductComponent,
    AllProductsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
  ]
})
export class ProductsModule { }
