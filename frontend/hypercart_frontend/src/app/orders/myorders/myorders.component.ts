import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import Toastify from 'toastify-js'
@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent implements OnInit{
  constructor(private router:Router,private serverService:ServerService){}
      lstData=[]
      strErrorText=''
      ngOnInit(): void {
        this.getData()
      }
      getData(){
      this.serverService.getData('orders/get_orders').subscribe(
      (res:any)=>{
        if (res['status']==1){

          this.lstData=res['lst_data']

        }
        else{
          this.strErrorText='Error Occured!'
          this.showErrorToast()
        }
      },
      (err:any)=>{
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
