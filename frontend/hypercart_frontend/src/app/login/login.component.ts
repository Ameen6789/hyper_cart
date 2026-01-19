import { Component } from '@angular/core';
import { OrdersRoutingModule } from "../orders/orders-routing.module";
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
import { ServerService } from '../server.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OrdersRoutingModule,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  blnShowPassword=false

  strEmail=''
  strPassword=''
  strErrorText=''
    login(){

    if (!this.strEmail){
      this.strErrorText='Enter Email'
      this.showToast()
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(this.strEmail)) {
        this.strErrorText='Enter Valid Email'
        this.showToast()
        return
    } 


    if (!this.strPassword){
      this.strErrorText='Enter Password'
      this.showToast()
      return
    }





    let dct_data:any={}
    dct_data['email']=this.strEmail
    dct_data['password']=this.strPassword

    
    this.serverService.putData('users/login_api/',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){
          this.showToastSuccess()
          localStorage.setItem('access_token',res['data']['access'])
          localStorage.setItem('refresh',res['data']['refresh'])
          localStorage.setItem('user_type',res['data']['user_type'])
          localStorage.setItem('user_id',res['data']['user_id'])
          localStorage.setItem('full_name',res['data']['name'])
          this.auth.loginSuccess(res['data']['access'], res['data']['refresh']); // 🔥 REQUIRED

          this.router.navigate(['/'])
        }
        else if (res['status']==0){
          this.strErrorText=res['message']
          this.showToast()

    //           "data": {
    //     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY3ODIyNTEyLCJpYXQiOjE3Njc4MTE3MTIsImp0aSI6IjI4NmNiZmZmNGEwODQ0ODliMDhlNGMxNWU0YTI2OWJlIiwidXNlcl9pZCI6IjEifQ.kAcMRIuHA2DAKE1w_J2POmMxNe6mPbslw__ZkqXb9s4",
    //     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2ODI0MzcxMiwiaWF0IjoxNzY3ODExNzEyLCJqdGkiOiI2NzVkYTkyZTI3ZjA0NGEyYmU5ZTg1ZjRlN2MzMTE5MCIsInVzZXJfaWQiOiIxIn0.pkPJMYP_7M-wzJqB0gKuSPr_U_JjdorbkFo9p2xyGjo",
    //     "user_type": "CUSTOMER",
    //     "user_id": 1,
    //     "name": "Azarath Ameen C A"
    // }
        }
      },
      ()=>{

      }
    )
  }

    showToast() {
    Toastify({
      text: `
        <div class="toast-content d-flex align-items-center">
        <span style="color: orange; font-size: 16px;" class="me-1">❌</span>
        <span class="text-black ">${this.strErrorText}</span>
      </div>
      `,
      escapeMarkup: false,
      duration: 3000,
      gravity: 'above',
      position: 'center',
      style: {
        background: 'white',
  
        borderRadius: '10px'
      }
    }).showToast();
  }
    showToastSuccess() {
      Toastify({
        text: `
         <div class="toast-content d-flex align-items-center">
         <div style="background-color:#16a34a;margin-right:7px;border-radius:50%;width:22px;height:22px;" class="d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-check tick-icon" style="font-size:12px;"></i>
          </div>
          <span class="text-black">Logged In Successfully</span>
        </div>
        `,
        escapeMarkup: false,
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
          background: 'white',
    
          borderRadius: '10px'
        }
      }).showToast();
    }
}
