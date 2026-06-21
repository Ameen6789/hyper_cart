import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent implements OnInit{
    constructor(private router:Router,private serverService:ServerService,private spinnerService:NgxSpinnerService){}
    lstCategories=[]

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
    this.listCategory()
  }
  
  editCategory(category:any){
    localStorage.setItem('intCategoryId',category.id)
    this.router.navigate(['/seller/editcategory'])
  
  }
  listCategory(){
    this.spinnerService.show()
    this.serverService.getData('products/list_category').subscribe(
      (res)=>{
        this.spinnerService.hide()
        if (res['status']==1){
          this.lstCategories=res['lstData']
        }
        else{
  
        }
      },
      (err)=>{
        this.spinnerService.hide()
      }
    )
  }
}
