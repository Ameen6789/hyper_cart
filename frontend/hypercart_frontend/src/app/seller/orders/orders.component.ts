import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import Toastify from 'toastify-js'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
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
      constructor(private router:Router,private serverService:ServerService){}

      lstData=[]
      strErrorText=''

      ngOnInit(): void {
        this.getData()
      }
      getData(){
      this.serverService.postData('orders/get_orders',{}).subscribe(
      (res)=>{
        if (res['status']==1){

          this.lstData=res['lst_data']

        }
        else{
          this.strErrorText='Error Occured!'
          this.showErrorToast()
        }
      },
      (err)=>{
          this.strErrorText='Error Occured!'
          this.showErrorToast()
      }
    )
    }

        showErrorToast() {
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


}
