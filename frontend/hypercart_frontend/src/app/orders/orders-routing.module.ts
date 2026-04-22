import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { MyordersComponent } from "./myorders/myorders.component";
import { AddAddressComponent } from "./add-address/add-address.component";
import { CartComponent } from "./cart/cart.component";
import { authGuard } from "../auth.gurad";

const routes:Routes =[
    {path:'myorders',component:MyordersComponent,title:'My Orders',canActivate: [authGuard]},
    {path:'add_address',component:AddAddressComponent,title:'Add Address',canActivate: [authGuard]},
    {path:'cart',component:CartComponent,title:'Cart',canActivate: [authGuard]}
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OrdersRoutingModule{}