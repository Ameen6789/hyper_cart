import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerRoutingModule } from './seller-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { OrdersComponent } from './orders/orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AddProductComponent,
    ListProductComponent,
    OrdersComponent,
    EditProductComponent,
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    FormsModule,
  ]
})
export class SellerModule { }
