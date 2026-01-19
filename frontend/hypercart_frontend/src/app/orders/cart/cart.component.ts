import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements  OnInit{

  constructor(private router:Router,private serverService:ServerService){}
  hostname=''
  lstData:any=[]
  strErrorText:string=''
  dblPrice=0
  totalQty=0
  lstAddress=[]
  AddressId:any
  ngOnInit(): void {
    this.hostname=this.serverService.hostname.slice(0,-1)
    this.getData()
    this.getAddress()
  }
onAddressChange(event:any){
  if (event.target.value=='change_address'){
    this.router.navigate(['/orders/add_address'])
  }
  else{
    this.AddressId=Number(event.target.value)
  }

  console.log(event)
}
showToast() {
  Toastify({
    text: `
     <div class="toast-content d-flex align-items-center">
     <div style="background-color:#16a34a;margin-right:7px;border-radius:50%;width:22px;height:22px;" class="d-flex align-items-center justify-content-center">
      <i class="fa-solid fa-check tick-icon" style="font-size:12px;"></i>
      </div>
      <span class="text-black">Order Placed Successfully</span>
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
getData(){
     this.serverService.postData('orders/get_cart_items',{}).subscribe(
      (res)=>{
        if (res['status']==1){
          this.lstData=res['lst_data']
          for (let data of this.lstData){
            this.dblPrice+=data['dbl_total_amt']
            this.totalQty+=data['int_qty']
          }

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
changeQty(status:number,data:any){
  let dct_data:any={}
  if (status==1){
    data['int_qty']=data['int_qty']-=1
    data['dbl_total_amt']=data['dbl_ppu']*(data['int_qty'] || 0)
    dct_data['intId']=data['id']
    dct_data['intQty']=data['int_qty']


  }
  else if (status==2){
    data['int_qty']=data['int_qty']+=1
    data['dbl_total_amt']=data['dbl_ppu']*(data['int_qty'] || 0)
    dct_data['intId']=data['id']
    dct_data['intQty']=data['int_qty']



  }
  else if (status==3){

    dct_data['intId']=data['id']
    dct_data['intQty']=data['int_qty']
    data['dbl_total_amt']=data['dbl_ppu']*(data['int_qty'] || 0)


  }

    else if (status==4){


    dct_data['intId']=data['id']
    dct_data['intQty']=0
    data['int_qty']=0


  }

      this.serverService.putData('orders/add_items',dct_data).subscribe(
      (res)=>{
        if (res['status']==1){
          if (data['int_qty']<=0){
            this.lstData = this.lstData.filter((item:any) => item.id !== data.id);

          }

            data['dbl_total_amt']=data['dbl_ppu']*(data['int_qty'] || 0)
            this.dblPrice=0
            this.totalQty=0
            for (let data of this.lstData){
              this.dblPrice+=data['dbl_total_amt']
              this.totalQty+=data['int_qty']
            }
          
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

    getAddress(){
      this.serverService.getData('orders/add_address').subscribe(
      (res)=>{
        if (res['status']==1){

          this.lstAddress=res['lst_data']
          if (this.lstAddress.length>0){
            this.AddressId= this.lstAddress[0]['id']
          }
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

    addOrder(){
      if (!this.lstData || this.lstData.length==0){
        this.strErrorText='Add Atleast One Item to Cart'
        this.showErrorToast()
      }
      else if (!this.AddressId){
        this.strErrorText='Select an Address'
        this.showErrorToast()
      }
      else{
        let dctData:any={}
        dctData['lstItemData']=this.lstData
        dctData['intAddressId']=this.AddressId
        dctData['dblTotalAmount']=this.dblPrice
          this.serverService.postData('orders/add_order',dctData).subscribe(
      (res)=>{
        if (res['status']==1){

          this.showToast()
          this.router.navigate(['/orders/myorders'])
        }
        else{
          this.strErrorText=res['message']
          this.showErrorToast()
        }
      },
      (err)=>{
          this.strErrorText='Error Occured!'
          this.showErrorToast()
      }
    )
      }
    }
}



