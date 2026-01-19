import { Component, HostListener, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsRoutingModule } from "../products/products-routing.module";
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ServerService } from '../server.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ProductsRoutingModule,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isOpen:boolean=false
  constructor(private modalService: NgbModal,private auth:AuthService,private serverService:ServerService,private router:Router){}
  
 isLoggedIn$!: any;
  window1=''

  showModal=false
  email=''
  fullName=''
  access_token=''
  userType=''
  lstProducts:any=[]
  searchTerm=''
  @HostListener('window:resize',)
onResize() {
  if (window.innerWidth > 700) {
    document?.getElementById('mobileNav')?.classList.remove('open');

  }
}


ngOnInit(): void {
    window.scrollTo(0, 0);

   this.auth.isLoggedIn$.subscribe(value => {
    this.isLoggedIn$ = value;
    })
   this.fullName=localStorage.getItem('full_name') || ''
   this.email=localStorage.getItem('email') || ''
   this.access_token=localStorage.getItem('access_token') || ''
   this.userType=localStorage.getItem('user_type') || ''
   console.log(this.access_token,"ss")
   if (this.access_token){
    this.isLoggedIn$=true
   }
   else{
    this.isLoggedIn$=false
   }
}
  openModal(content: any) {
  this.modalService.open(content, {
    centered: true,
    backdrop: true,
        windowClass: 'custom-modal',
        size: 'xl',


  });
}

toggleMenu() {
    document?.getElementById('mobileNav')?.classList.toggle('open');
    document.body.classList.add("no-scroll");
  
  }

  navItemClicked(){
    document?.getElementById('mobileNav')?.classList.toggle('open');

  }
  openProfileModal(){
    this.showModal=true
  }
logoutUser() {
  this.showModal=false
  this.serverService.postData('users/logout_api', {}).subscribe({
    next: () => {
      this.auth.logout();
      this.showModal = false;
      this.isLoggedIn$=false
    },
    error: () => {
      this.auth.logout(); // even if backend fails
    }
  });
}
searchProducts(){
  this.serverService.postData('products/search_product',{'searchTerm':this.searchTerm}).subscribe((res)=>{
    if (res['status']==1){
      this.lstProducts=res['lst_data']
      console.log(res['lstData'])
    }
  },(err)=>{

  })

  }

  viewProduct(id:any){
    console.log("asdfdsf")
    localStorage.setItem('productId',String(id))
    this.modalService.dismissAll()
    this.router.navigate(['products/viewproduct'])
  }
  navigate(){
    window.scrollTo(0,0)
  }

}
