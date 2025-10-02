import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../../services/admin.service';
import { StorageService } from '../../../services/storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  id: any;
  orderData: any;
  baseUrl = environment.API_URL;
  totalPrice: number = 0;
  userData: any;
  constructor(private route: ActivatedRoute, private orderService: OrderService,
    private adminService: AdminService, private storageService: StorageService,
    private toastrService: ToastrService) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        let data: any = this.storageService.getItem('userData');
        this.userData = JSON.parse(data);
        if (this.userData.isAdmin) {
          this.getAdminOrderById();
        }
        else
          this.getOrderById();
      }
    })
  }
  getOrderById() {
    let data = {
      id: Number(this.id)
    }
    this.orderService.getOrderById(data).subscribe(res => {
      this.orderData = res.data;
      this.totalPrice = 0;
      this.orderData.orderItems.forEach((ele: any) => {
        let productprice = 0
        productprice += ele.quantity * ele.price;
        this.totalPrice += ele.productQty * productprice;
      })
    })
  }
  getAdminOrderById() {
    let data = {
      id: Number(this.id)
    }
    this.adminService.getAdminOrderById(data).subscribe(res => {
      this.orderData = res.data;
      this.totalPrice = 0;
      this.orderData.orderItems.forEach((ele: any) => {
        let productprice = 0
        productprice += ele.quantity * ele.price;
        this.totalPrice += ele.productQty * productprice;
      })
    })
  }
  changeOrderStatus() {
    let data = {
      "id": Number(this.id),
      "orderStatus": this.orderData.orderStatus,
      "paymentStatus": this.orderData.paymentStatus
    }
    this.adminService.updateOrderStatus(data).subscribe(res => {
      this.toastrService.success(res.message);
      this.getAdminOrderById();
    })
  }
  redirectToWhatsapp() {
    const url = `whatsapp://send?phone=${this.orderData?.mobile}`;
    window.open(url, '_blank');
  }
  redirectToMail() {
    const url = `mailto:${this.orderData?.email}`;
    window.open(url, '_blank');
  }
}
