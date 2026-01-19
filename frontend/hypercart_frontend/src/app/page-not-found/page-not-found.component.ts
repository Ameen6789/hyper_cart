import { Component } from '@angular/core';
import { OrdersRoutingModule } from "../orders/orders-routing.module";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [OrdersRoutingModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
