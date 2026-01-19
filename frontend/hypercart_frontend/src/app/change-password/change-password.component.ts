import { Component, OnInit } from '@angular/core';
import { OrdersRoutingModule } from "../orders/orders-routing.module";
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
import { ServerService } from '../server.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{
constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  blnShowPassword=false
  blnShowPassword2=false
  blnShowPassword3=false 
  strCurrentPassword=''
  strNewPassword=''
  strConfirmNewPassword=''
  strPassword=''
  strErrorText=''
  userId=''
  ngOnInit(): void {
    this.userId=localStorage.getItem('user_id') || ''
  }
    login(){

    if (!this.strCurrentPassword){
      this.strErrorText='Enter Current Passwsrd'
      this.showToast()
      return
    }

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







    let dct_data:any={}
    dct_data['userid']=this.userId
    dct_data['password']=this.strCurrentPassword
    dct_data['newPassword']=this.strNewPassword

    this.serverService.postData('users/change_password',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){
          this.showToastSuccess()
          // localStorage.setItem('access_token',res['data']['access'])
          // localStorage.setItem('refresh',res['data']['refresh'])
          // localStorage.setItem('user_type',res['data']['user_type'])
          // localStorage.setItem('user_id',res['data']['user_id'])
          // localStorage.setItem('full_name',res['data']['name'])
          // this.auth.loginSuccess(res['data']['access'], res['data']['refresh']); // 🔥 REQUIRED
          this.auth.logout()
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
          <span class="text-black">Pasword Updated In Successfully</span>
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
