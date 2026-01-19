import { Component, HostListener, OnInit } from '@angular/core';

import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit{

constructor(private serverService:ServerService,private router:Router){}
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
intStock=0
intProductPrice=0
intOfferPrice=0
strProductDescription=''
strProduct=''
lstCategory:any=[]
strErrorText:string=''
selectedCategory=null
selectedCategoryId:Number=0
image1:any='assets/images/upload_area.png'
image2:any='assets/images/upload_area.png'
image3:any='assets/images/upload_area.png'
image4:any='assets/images/upload_area.png'
imageFile1:any
imageFile2:any
imageFile3:any
imageFile4:any

ngOnInit(): void {
  this.getCategory()
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

addProduct(){
  console.log(this.image1)
  if (!this.imageFile1 && !this.imageFile2 && !this.imageFile3 && !this.imageFile4){
    this.strErrorText='Add Atleast One Image'
    this.showToast()
    return
  }
  if (!this.strProduct){
    this.strErrorText='Enter Product'
    this.showToast()
    return
  }
    if (!this.strProductDescription){
    this.strErrorText='Enter Product Description'
    this.showToast()
    return

  }
      if (!this.selectedCategoryId){
    this.strErrorText='Select Catgeory'
    this.showToast()
    return

  }
    if (!this.intStock){
    this.strErrorText='Enter Stock Qty'
    this.showToast()
    return

  }
    if (!this.intProductPrice){
    this.strErrorText='Enter Product Price'
    this.showToast()
    return

  }
  let formData=new FormData
  if (this.imageFile1){
    formData.append('image1',this.imageFile1)

  }
    if (this.imageFile2){
    formData.append('image2',this.imageFile2)

  }
    if (this.imageFile3){
    formData.append('image3',this.imageFile3)

  }
    if (this.imageFile4){
    formData.append('image4',this.imageFile4)

  }
  formData.append('strProduct',this.strProduct)
  formData.append('strProductDescription',this.strProductDescription)
  formData.append('selectedCategoryId',String(this.selectedCategoryId))
  formData.append('intStock',String(this.intStock))
  formData.append('intProductPrice',String(this.intProductPrice))
  formData.append('intOfferPrice',String(this.intOfferPrice))
  this.serverService.postData('products/add_product',formData).subscribe(
    (res)=>{
      if (res['status']==1){
        this.showToastSuccess()
        this.router.navigate(['/seller/listproduct'])

      }
      else{
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
    categoryChanged(category:any){
      this.selectedCategoryId=category.id
    }

    onFileChange1(event:any){
      const file=event.target.files[0]
      if (file){
        // this.image1=file.name
        // console.log(file)
        this.imageFile1=file
         const reader = new FileReader();
          reader.onload = () => {
            this.image1 = reader.result; // 👈 instant preview
          };
          reader.readAsDataURL(file);
          this.image1=file
      }
    }
    onFileChanged2(event:any){
      const file=event.target.files[0]
      if (file){
        this.imageFile2=file

        const reader=new FileReader()
        reader.onload=()=>{
          this.image2=reader.result
        }
        reader.readAsDataURL(file)
      }
    }
    onFileChanged3(event:any){
      const file=event.target.files[0]
      if (file){
        this.imageFile3=file
        const reader=new FileReader()
        reader.onload=()=>{
          this.image3=reader.result
        }
        reader.readAsDataURL(file)
      }
    }
    onFileChanged4(event:any){
      const file=event.target.files[0]
      if (file){
        this.imageFile4=file
        const reader=new FileReader()
        reader.onload=()=>{
          this.image4=reader.result
        }
        reader.readAsDataURL(file)
      }
    }

    showToastSuccess() {
      Toastify({
        text: `
         <div class="toast-content d-flex align-items-center">
         <div style="background-color:#16a34a;margin-right:7px;border-radius:50%;width:22px;height:22px;" class="d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-check tick-icon" style="font-size:12px;"></i>
          </div>
          <span class="text-black">Product Added Successfully</span>
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

