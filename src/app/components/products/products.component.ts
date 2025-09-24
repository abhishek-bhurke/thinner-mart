import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [MatIconModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  constructor(private router: Router, private productService: ProductService) { }
  ngOnInit() {
    this.getAllProducts();
  }
  redirectToProduct() {
    this.router.navigate(['product'], { queryParams: { id: 0 } })
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe(res => {

    })
  }
}
