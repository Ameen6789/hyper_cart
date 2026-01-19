import { Component, OnInit } from '@angular/core';
import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrl: './viewproduct.component.css'
})
export class ViewproductComponent implements OnInit{
constructor(private serverService:ServerService,private router:Router,private auth:AuthService){}
  intProductId:any
  dctData:any={}
  hostname=''
  mainImage=''
  lstData=[]
  isLoggedIn$:any
  ngOnInit(): void {
    this.intProductId=localStorage.getItem('productId') || ''
    this.hostname=this.serverService.hostname.slice(0,-1)
    this.auth.isLoggedIn$.subscribe(value => {
    this.isLoggedIn$ = value;
    })

    this.getData()
  }
  buyProduct(status:Number){
  if (!this.isLoggedIn$){
    this.showToast()
    return
  }
  else{
    let dct_data:any={}
    dct_data['intProductId']=this.intProductId
    this.serverService.postData('orders/add_items',dct_data).subscribe(
      (res)=>{
        console.log(res)
        if (res['status']==1){
          this.showToastSuccess()
          if (status==2){
            this.router.navigate(['/orders/cart'])
          }
        }
        else{

        }
      },
      (err)=>{

      }
    )
  }

}

showToast() {
  Toastify({
    text: `
     <div class="toast-content d-flex align-items-center">
     <span style="color: orange; font-size: 16px;" class="me-1">⚠️</span>
      <span class="text-black ">PLease Login</span>
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
    this.intProductId=localStorage.getItem('productId') || ''
    let dct_data={'intProductId':Number(this.intProductId)}
    this.serverService.postData('products/list_product',dct_data).subscribe(
      (res)=>{
        if (res['status']==1){
          this.dctData=res['data']
          this.lstData=res['lstData']
          this.mainImage=this.hostname+res['data']?.['jsn_images']?.[0]
          console.log(this.mainImage)
        }
        else{
          
        }
      },
      (err)=>{

      }
    )

}
changeMainImage(path:any){
  this.mainImage=path
}
    viewProduct(id:any){
      localStorage.setItem('productId',id) 
      console.log('clidghsa')
      this.getData()
      this.scrollToTop()
    }

  addToCart(){
    if (!this.isLoggedIn$){
    this.showToast()
    return
    }
    else{
      console.log("carted")
    }
  }

  showToastSuccess() {
    Toastify({
      text: `
       <div class="toast-content d-flex align-items-center">
       <div style="background-color:#16a34a;margin-right:7px;border-radius:50%;width:22px;height:22px;" class="d-flex align-items-center justify-content-center">
        <i class="fa-solid fa-check tick-icon" style="font-size:12px;"></i>
        </div>
        <span class="text-black">Item Added to Cart</span>
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
  scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
