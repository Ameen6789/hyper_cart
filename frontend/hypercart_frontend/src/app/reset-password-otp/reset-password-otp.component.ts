import { Component, OnInit } from '@angular/core';
import Toastify from 'toastify-js'
import { Router, RouterLink } from '@angular/router';
import { ServerService } from '../server.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-reset-password-otp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-otp.component.html',
  styleUrl: './reset-password-otp.component.css'
})
export class ResetPasswordOtpComponent implements OnInit{
constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  blnShowPassword=false

  strEmail=''
  strErrorText=''
  ShowError=false
  strOtp:any
  resetPassword=false
  isReset=false
  timeLeft = 30;
  timer: any;
  ngOnInit(): void {
    this.strEmail=localStorage.getItem('password_email') || ''
    this.startTimer()
  }
    login(){

    if (!this.strOtp){
      this.strErrorText='Enter Otp'
      this.showToast()
      return
    }
    let dct_data:any={}
    dct_data['strEmail']=this.strEmail
    dct_data['strOtp']=this.strOtp

    this.serverService.putData('users/forgot_password',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){

          this.router.navigate(['/reset-password'])
        }
        else if (res['status']==2){
          this.strErrorText=res['message']
          this.showToast()


        }
        else if (res['status']==0){
          this.strErrorText=res['message']
          this.showToast()


        }
      },
      (err)=>{
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



  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.isReset=true
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resendOtp(){


    let dct_data:any={}
    dct_data['strEmail']=this.strEmail

    this.serverService.postData('users/forgot_password',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){

        this.ShowError=false
        this.isReset=false
        this.timeLeft=30
        this.startTimer()
        localStorage.setItem('password_email',this.strEmail)
        
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
}
