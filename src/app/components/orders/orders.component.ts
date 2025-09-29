import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  ordersList: any[] = [];
  baseUrl = environment.API_URL;
  constructor(private orderService: OrderService, private cartService: CartService, private router: Router) {
    this.cartService.cartUpdateSubject.next(true)
  }
  ngOnInit() {
    this.getAllOrders();
  }
  getAllOrders() {
    this.orderService.getAllOrders().subscribe(res => {
      this.ordersList = res.data;
    })
  }
  goToProducts() {
    this.router.navigate(['products']);
  }
}
