import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Toastify from 'toastify-js'
import { Router } from '@angular/router';
@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.css'
})
export class ProductsHomeComponent implements OnInit{
  constructor(private serverService:ServerService,private router:Router){}

  selectedIndex = -1;
  hostname=''
  intCategoryId=null
  lstData=[]
  lstCategory=[]
  strErrorText=''
  ngOnInit(): void {
    this.hostname=this.serverService.hostname.slice(0,-1)
    this.getCategory()
    this.getData()
  }
setActive(i: number,label:any) {
  this.selectedIndex = i;
  this.intCategoryId=label.id
  console.log(this.intCategoryId)
  this.getData()
}
getData(){
  let dct_data:any={}

  if (this.intCategoryId){
    dct_data['IntCategoryId']=this.intCategoryId
  }
  this.serverService.postData('products/list_product',dct_data).subscribe(
    (res:any)=>{
      if (res['status']==1){
        this.lstData=res['lstData']
      }
      else{

      }
    },
    (err:any)=>{

    }
  )
}

getCategory(){
  this.serverService.getData('products/list_category').subscribe((res)=>{
    if (res['status']==1){
      this.lstCategory=res['lstData']
      console.log(res['lstData'])
    }
  },(err)=>{

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
