import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CarouselModule } from "primeng/carousel";
import { TooltipModule } from 'primeng/tooltip';
import { MatIconModule } from "@angular/material/icon";
import { StorageService } from '../../services/storage.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, CarouselModule, TooltipModule, MatIconModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  ordersList: any[] = [];
  baseUrl = environment.API_URL;
  constructor(private orderService: OrderService, private cartService: CartService, private router: Router,
    private storageService: StorageService, private adminService: AdminService) {
    this.cartService.cartUpdateSubject.next(true)
  }
  ngOnInit() {
    let data: any = this.storageService.getItem('userData');
    let userData = JSON.parse(data);
    if (userData.isAdmin) {
      this.getAdminOrders();
    }
    else {
      this.getAllOrders();
    }
  }
  getAllOrders() {
    this.orderService.getAllOrders().subscribe(res => {
      this.ordersList = res.data;
    })
  }
  getAdminOrders() {
    this.adminService.getAllAdminOrders().subscribe(res => {
      this.ordersList = res.data;
    })
  }
  goToProducts() {
    this.router.navigate(['products']);
  }
  gotToOrderDetails(id: any) {
    this.router.navigate(['order-details'], { queryParams: { id: id } })
  }
}
