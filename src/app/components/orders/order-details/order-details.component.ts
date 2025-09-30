import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Timeline } from 'primeng/timeline';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, Timeline],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  id: any;
  orderData: any;
  baseUrl = environment.API_URL;
  totalPrice: number = 0;
  constructor(private route: ActivatedRoute, private orderService: OrderService) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
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
}
