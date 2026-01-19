import { Component } from '@angular/core';
import { OrdersRoutingModule } from "../orders/orders-routing.module";
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
import { ServerService } from '../server.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
 constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  blnShowPassword=false

  strEmail=''
  strErrorText=''
  ShowError=false
  intOtp:any
  resetPassword=false

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








    let dct_data:any={}
    dct_data['strEmail']=this.strEmail

    this.serverService.postData('users/forgot_password',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){

        this.ShowError=false
        localStorage.setItem('password_email',this.strEmail)
        this.router.navigate(['/reset-password-otp'])
      }
        else if (res['status']==2){

          this.ShowError=true


        }
        else if (res['status']==0){
          this.strErrorText=res['message']
          this.showToast()
          this.ShowError=false


        }
      },
      (error)=>{
          this.strErrorText='Error Occured'
          this.showToast()
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
