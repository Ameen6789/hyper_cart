import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { MyordersComponent } from "./myorders/myorders.component";
import { AddAddressComponent } from "./add-address/add-address.component";
import { CartComponent } from "./cart/cart.component";

const routes:Routes =[
    {path:'myorders',component:MyordersComponent,title:'My Orders'},
    {path:'add_address',component:AddAddressComponent,title:'Add Address'},
    {path:'cart',component:CartComponent,title:'Cart'}
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OrdersRoutingModule{}