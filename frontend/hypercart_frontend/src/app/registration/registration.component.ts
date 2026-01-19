import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Toastify from 'toastify-js'
import { ServerService } from '../server.service';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private serverService:ServerService,private router:Router){}
  blnShowPassword1=false
  blnShowPassword2=false
  strErrorText=''
  strName=''
  strEmail=''
  strPassword=''
  strConfirmPassword=''
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

  Register(){
    if (!this.strName){
      this.strErrorText='Enter Name'
      this.showToast()
      return
    }
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
    if (this.strPassword && this.strPassword.length<8){
      this.strErrorText='Password Should be atleast 8 characters'
      this.showToast()
      return
    }
    if (!this.strConfirmPassword){
      this.strErrorText='Enter Confirm Password'
      this.showToast()
      return
    }

    if (this.strConfirmPassword && this.strConfirmPassword.length<8){
      this.strErrorText='Confirm Password Should be atleast 8 characters'
      this.showToast()
      return
    }
    if (this.strPassword!== this.strConfirmPassword){
      this.strErrorText='Password and Confirm Password Do Not Match'
      this.showToast()
      return
    }
    let dct_data:any={}
    dct_data['strName']=this.strName
    dct_data['email']=this.strEmail
    dct_data['password']=this.strPassword

    
    this.serverService.postData('users/login_api/',dct_data).subscribe(
      (res:any)=>{
        if (res['status']==1){
          this.showToastSuccess()
          this.router.navigate(['login'])
        }
        else if (res['status']==0){
          this.strErrorText=res['message']
          this.showToast()
        }
      },
      ()=>{

      }
    )
  }
  
  showToastSuccess() {
    Toastify({
      text: `
       <div class="toast-content d-flex align-items-center">
       <div style="background-color:#16a34a;margin-right:7px;border-radius:50%;width:22px;height:22px;" class="d-flex align-items-center justify-content-center">
        <i class="fa-solid fa-check tick-icon" style="font-size:12px;"></i>
        </div>
        <span class="text-black">Account Created Successfully</span>
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
