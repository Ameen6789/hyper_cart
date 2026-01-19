import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Toastify from 'toastify-js';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{

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
selectedCategory:any=null
selectedCategoryId:Number=0
image1:any='assets/images/upload_area.png'
image2:any='assets/images/upload_area.png'
image3:any='assets/images/upload_area.png'
image4:any='assets/images/upload_area.png'
imageFile1:any
imageFile2:any
imageFile3:any
imageFile4:any
intProductId:any;
dctProductData:any={};
selectedCategoryname:any;
hostname:string=''

ngOnInit(): void {
  this.getCategory()
  this.getData()
  this.hostname=this.serverService.hostname.slice(0,-1)

}
getCategory(){
  this.serverService.getData('products/list_category').subscribe((res:any)=>{
    if (res['status']==1){
      this.lstCategory=res['lstData']
    }
  },(err:any)=>{

  })

}


getData(){
  this.intProductId=localStorage.getItem('productId') || ''
  let dct_data={'intProductId':Number(this.intProductId)}
  this.serverService.putData('products/add_product',dct_data).subscribe((res:any)=>{
    if (res['status']==1){
      this.dctProductData=res['data']
      this.strProduct=this.dctProductData['vchr_name']
      this.strProductDescription=this.dctProductData['vchr_description']
      this.selectedCategoryId=this.dctProductData['fk_category_id']
      this.selectedCategoryname=this.dctProductData['fk_category__vchr_name']
      this.intProductPrice=this.dctProductData['dbl_selling_price']
      this.intOfferPrice=this.dctProductData['dbl_offer_price']
      this.intStock=this.dctProductData['int_stock_qty']
      this.strProduct=this.dctProductData['vchr_name']
      if (this.dctProductData['jsn_images'] && this.dctProductData['jsn_images'][0]){
        this.image1=this.dctProductData['jsn_images'][0] ?? null
        this.imageFile1=this.dctProductData['jsn_images'][0] ?? null

        this.image2=this.dctProductData['jsn_images'][1] ?? null
        this.imageFile2=this.dctProductData['jsn_images'][1] ?? null

        this.image3=this.dctProductData['jsn_images'][2] ?? null
        this.imageFile3=this.dctProductData['jsn_images'][2] ?? null

        this.image4=this.dctProductData['jsn_images'][3] ?? null
        this.imageFile4=this.dctProductData['jsn_images'][3] ?? null
 
        if (this.image1){
          this.image1=this.hostname+this.image1
        }
        if (!this.image1){
          this.image1='assets/images/upload_area.png'
        }
        if (this.image2){
          this.image2=this.hostname+this.image2
        }
        if (!this.image2){
          this.image2='assets/images/upload_area.png'
        }
        if (this.image3){
          this.image3=this.hostname+this.image3
        }
        if (!this.image3){
          this.image3='assets/images/upload_area.png'
        }
        if (this.image4){
          this.image4=this.hostname+this.image4
        }

        if (!this.image4){
          this.image4='assets/images/upload_area.png'
        }
      }

      this.selectedCategory={'id':this.dctProductData['fk_category_id'],'vchr_name':this.dctProductData['fk_category__vchr_name']}

      console.log(this.selectedCategory)
    }
  },(err:any)=>{

  })

}

updateProduct(){
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
  formData.append('intProductId',this.intProductId)
  formData.append('strProduct',this.strProduct)
  formData.append('strProductDescription',this.strProductDescription)
  formData.append('selectedCategoryId',String(this.selectedCategoryId))
  formData.append('intStock',String(this.intStock))
  formData.append('intProductPrice',String(this.intProductPrice))
  formData.append('intOfferPrice',String(this.intOfferPrice))
  this.serverService.patchData('products/add_product',formData).subscribe(
    (res:any)=>{
      if (res['status']==1){
        this.showToastSuccess()
        this.router.navigate(['/seller/listproduct'])
      }
      else{
        this.strErrorText=res['message']
        this.showToast()
      }
    },
    (err:any)=>{
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
      console.log(this.selectedCategory)
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
          <span class="text-black">Product Updated Successfully</span>
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

    removeImage(num:any){
      if (num==1){
        this.image1='assets/images/upload_area.png'
        this.imageFile1=null
      }
      if (num==2){
        this.image2='assets/images/upload_area.png'
        this.imageFile2=null
      }
      if (num==3){
        this.image3='assets/images/upload_area.png'
        this.imageFile3=null
      }
      if (num==4){
        this.image4='assets/images/upload_area.png'
        this.imageFile4=null
      }
    }
  }

