import { Component, OnInit } from '@angular/core';
import { OrdersRoutingModule } from "../orders/orders-routing.module";
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
import { ServerService } from '../server.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  blnShowPassword2=false
  blnShowPassword3=false 
  strNewPassword=''
  strConfirmNewPassword=''
  strPassword=''
  strErrorText=''
  strEmail=''

    login(){


    if (!this.strNewPassword){
      this.strErrorText='Enter New Passwsrd'
      this.showToast()
      return
    }
    if (!this.strConfirmNewPassword){
      this.strErrorText='Enter Confirm Password'
      this.showToast()
      return
    }

    if (this.strNewPassword!== this.strConfirmNewPassword){
      this.strErrorText='New and Confirm Passwords do not match'
      this.showToast()
      return
    }

    this.strEmail=localStorage.getItem('password_email') || ''


    let dct_data:any={}
    dct_data['newPassword']=this.strNewPassword
    dct_data['strEmail']=this.strEmail



    this.serverService.patchData('users/forgot_password',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){
          this.showToastSuccess()
          this.router.navigate(['/login'])
        }
        else if (res['status']==0){
          this.strErrorText=res['message']
          this.showToast()


        }
      },
      (err:any)=>{
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
          <span class="text-black">Password Reset Successfullys</span>
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
