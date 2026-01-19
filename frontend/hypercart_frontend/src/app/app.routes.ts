import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordOtpComponent } from './reset-password-otp/reset-password-otp.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products/home', pathMatch: 'full' },

{path:"products",loadChildren:()=> import('./products/products.module').then(m=>m.ProductsModule),data: { layout: 'default' }},    
{path:"seller",loadChildren:()=> import('./seller/seller.module').then(m=>m.SellerModule),data: { layout: 'default' }},
{path:"orders",loadChildren:()=>import('./orders/orders.module').then(m=>m.OrdersModule),data: { layout: 'default' }},    
{path:"404",component:PageNotFoundComponent,data: { layout: 'blank' }},
{path:'login',component:LoginComponent,data:{layout:'blank'}},
{path:'register',component:RegistrationComponent,data:{layout:'blank'}},
{path:'forgot-password',component:ForgotPasswordComponent,data:{layout:'blank'}},
{path:'change-password',component:ChangePasswordComponent,data:{layout:'blank'}},
{path:'reset-password-otp',component:ResetPasswordOtpComponent,data:{layout:'blank'}},
{path:'reset-password',component:ResetPasswordComponent,data:{layout:'blank'}},
{path:"**",redirectTo:"404"}
];
