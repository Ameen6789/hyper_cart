import { Component, HostListener, OnInit } from '@angular/core';
import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
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

strCategory=''
strErrorText:string=''



ngOnInit(): void {
}

addCategory(){

      if (!this.strCategory){
    this.strErrorText='Add Catgeory'
    this.showToast()
    return

  }
  
  this.spinnerService.show()
  this.serverService.postData('products/list_category',{"strCategory":this.strCategory}).subscribe(
    (res)=>{
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
    (err)=>{
      this.strErrorText='Error Occured'
      this.showToast()
      this.spinnerService.hide()
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
          <span class="text-black">Category Added Successfully</span>
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
