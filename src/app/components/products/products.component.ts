import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [MatIconModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  constructor(private router: Router) { }

  redirectToProduct() {
    this.router.navigate(['product'], { queryParams: { id: 0 } })
  }
}
