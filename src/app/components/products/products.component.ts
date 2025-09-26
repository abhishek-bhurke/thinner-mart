import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [MatIconModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productsList: any[] = [];
  constructor(private router: Router, private productService: ProductService) { }
  ngOnInit() {
    this.getAllProducts();
  }
  redirectToProduct(id: any) {
    this.router.navigate(['product'], { queryParams: { id: id } })
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe(res => {
      this.productsList = res.data;
    })
  }
}
