import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import Toastify from 'toastify-js';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit{
  constructor(private router:Router,private serverService:ServerService){}
  strName:string=''
  intMobile:any
  intPincode:any
  strAddress=''
  strCity=''
  strState=''
  strErrorText=''
  ngOnInit(): void {
    
  }

  saveAddress(){
    console.log(this.strName,'sss')
    if (!this.strName.trim()){
      this.strErrorText='Enter Name'
      this.showErrorToast()
      return
    }
    if (!this.intMobile){
      this.strErrorText='Enter Mobile Number'
      this.showErrorToast()
      return
    }
    if (!this.intPincode){
      this.strErrorText='Enter PinCode'
      this.showErrorToast()
      return
    }
    if (!this.strAddress.trim()){
      this.strErrorText='Enter Address'
      this.showErrorToast()
      return
    }
    if (!this.strCity.trim()){
      this.strErrorText='Enter City'
      this.showErrorToast()
      return
    }
    if (!this.strState.trim()){
      this.strErrorText='Enter State'
      this.showErrorToast()
      return
    }
    let dctData:any={}
    if (this.strName){
      dctData['strName']=this.strName.trim()
    }
    if (this.strName){
      dctData['intMobile']=this.intMobile
    }
    if (this.strName){
      dctData['intPincode']=this.intPincode
    }
    if (this.strName){
      dctData['strAddress']=this.strAddress.trim()
    }
    if (this.strName){
      dctData['strCity']=this.strCity.trim()
    }
    if (this.strName){
      dctData['strState']=this.strState.trim()
    }
    this.serverService.postData('orders/add_address',dctData).subscribe(
      (res)=>{
        if (res['status']==1){
          this.router.navigate(['/orders/cart'])
        }
        else{
        this.strErrorText='Error Occured!'
        this.showErrorToast()
        }
      },
      (err)=>{
        this.strErrorText='Error Occured!'
        this.showErrorToast()
      }
    )

  }

      showErrorToast() {
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
}
