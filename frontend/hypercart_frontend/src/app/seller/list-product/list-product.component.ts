import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent implements OnInit{
  constructor(private router:Router,private serverService:ServerService){}
  lstProducts=[]
  hostname=''
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
ngOnInit(): void {
  this.listProduct()
  this.hostname=this.serverService.hostname.slice(0,-1)
}

viewProduct(product:any){
  localStorage.setItem('productId',product.id)
  this.router.navigate(['/products/viewproduct'])
}
editProduct(product:any){
  localStorage.setItem('productId',product.id)
  this.router.navigate(['/seller/edit-product'])

}
listProduct(){
  this.serverService.getData('products/list_product').subscribe(
    (res)=>{
      if (res['status']==1){
        this.lstProducts=res['lstData']
      }
      else{

      }
    },
    (err)=>{

    }
  )
}
}
