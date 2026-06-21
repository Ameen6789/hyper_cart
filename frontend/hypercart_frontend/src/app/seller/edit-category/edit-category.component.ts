import { Component, HostListener, OnInit } from '@angular/core';
import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
constructor(private serverService:ServerService,private router:Router,private spinnerService:NgxSpinnerService){}
@HostListener('window:resize',)
onResize() {
  if (window.innerWidth > 768) {
      Array.from(document.getElementsByClassName('nav-text'))
    .forEach(nav => nav.classList.remove('hide-text'));
  }
    if (window.innerWidth < 769) {

  Array.from(document.getElementsByClassName('nav-text'))
    .forEach(nav => nav.classList.add('hide-text'));
  }
}

strErrorText:string=''
strCategoryname:any=null
intCategoryId:any;
dctCategoryData:any={};
hostname:string=''

ngOnInit(): void {
  this.getData()

}



getData(){
  this.intCategoryId=localStorage.getItem('intCategoryId') || ''
  this.spinnerService.show()
  this.serverService.getData('products/list_category?intCategoryId='+this.intCategoryId).subscribe((res:any)=>{
    this.spinnerService.hide()
    if (res['status']==1){
      this.dctCategoryData=res['ins_category']
      this.strCategoryname=this.dctCategoryData['vchr_name']

    }
  },(err:any)=>{
    this.spinnerService.hide()
  })

}

updateCategory(){

    if (!this.strCategoryname){
    this.strErrorText='Select Catgeory'
    this.showToast()
    return

  }


  this.spinnerService.show()
  let dctData:any={}
  dctData['intCategoryId']=this.intCategoryId
  dctData['strCategory']=this.strCategoryname
  this.serverService.putData('products/list_category',dctData).subscribe(
    (res:any)=>{
      this.spinnerService.hide()
      if (res['status']==1){
        this.showToastSuccess()
        this.router.navigate(['/seller/listcategory'])
      }
      else{
        this.strErrorText=res['message']
        this.showToast()
      }
    },
    (err:any)=>{
      this.spinnerService.hide()
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
          <span class="text-black">Category Updated Successfully</span>
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

    compareCategory(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }


}
