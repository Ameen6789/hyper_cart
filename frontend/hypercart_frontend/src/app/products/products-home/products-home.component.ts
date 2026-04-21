import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.css'
})
export class ProductsHomeComponent implements OnInit{
  constructor(private serverService:ServerService,private router:Router,private spinnerService:NgxSpinnerService){}

  selectedIndex = -1;
  hostname=''
  intCategoryId=null
  lstData=[]
  lstCategory=[]
  strErrorText=''
  ngOnInit(): void {
    this.hostname=environment.production==true?'':this.serverService.hostname.slice(0,-1)
    this.getCategory()
    this.getData()
  }
setActive(i: number,label:any) {
  this.selectedIndex = i;
  this.intCategoryId=label.id
  this.getData()
}
getData(){
  let dct_data:any={}

  if (this.intCategoryId){
    dct_data['IntCategoryId']=this.intCategoryId
  }
  this.spinnerService.show()
  this.serverService.postData('products/list_product',dct_data).subscribe(
    (res:any)=>{
      this.spinnerService.hide()
      if (res['status']==1){
        this.lstData=res['lstData']
      }
      else{

      }
    },
    (err:any)=>{
      this.spinnerService.hide()
    }
  )
}

getCategory(){
  this.spinnerService.show()
  this.serverService.getData('products/list_category').subscribe((res)=>{
    this.spinnerService.hide()
    if (res['status']==1){
      this.lstCategory=res['lstData']
    }
  },(err)=>{
    this.spinnerService.hide()
  })

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

    viewProduct(id:any){
      localStorage.setItem('productId',id) 
      this.router.navigate(['products/viewproduct'])
    }

    redirectToView(num:any){
      localStorage.setItem('productId',String(num))
      this.router.navigate(['products/viewproduct'])
    }
}
