import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ZoomProductComponent } from './zoom-product/zoom-product.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { LoginService } from '../../services/login.service';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  imports: [CommonModule, MatIconModule, InputNumberModule, FormsModule, TabsModule, TooltipModule, TranslateModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  transformOrigin = 'center center';
  isZoomed = false;
  sizes = [
    { label: '500 ML', price: 50.5 },
    { label: '1 LTR', price: 92 },
    { label: '5 LTR', price: 426 },
    { label: '10 LTR', price: 846 },
    { label: '20 LTR', price: 1660 },
    { label: '220 LTR', price: 16999 }
  ];
  selectedIndex: number = -1;
  quantity: number = 1
  activeTab: 'description' | 'info' = 'description';
  id: any;
  product: any;
  selectedProduct: any = '';
  productsList: any[] = [];
  baseUrl = environment.API_URL;

  constructor(private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private loginService: LoginService,
    private storageService: StorageService,
    private toastrService: ToastrService) { }
  ngOnInit() {
    // this.id = this.route.snapshot.queryParamMap.get('id');
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getProductById();
      }
      this.getAllProducts();
      this.selectedProduct = '';
      this.selectedIndex = -1;
      this.quantity = 1;
    })
  }
  onMouseMove(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    this.transformOrigin = `${x}% ${y}%`;
    this.isZoomed = true;
  }

  onMouseLeave() {
    this.isZoomed = false;
    this.transformOrigin = 'center center';
  }

  zoomProduct() {
    let dialogRef = this.matDialog.open(ZoomProductComponent, {
      panelClass: 'zoom-in-dialog'
    })
  }

  selectSize(index: number) {
    this.selectedIndex = index;
    this.selectedProduct = this.product.variety[index];
    this.quantity = 1;
  }

  setTab(tab: 'description' | 'info') {
    this.activeTab = tab;
  }
  redirectToProduct(id: any) {
    this.router.navigate(['product'], { queryParams: { id: id } })
  }
  getProductById() {
    let data = {
      id: this.id
    }
    this.productService.getProductById(data).subscribe(res => {
      this.product = res.data
    })
  }
  addToCart() {
    if (this.loginService.isLoggedIn()) {
      let data = {
        "productId": Number(this.id),
        "size": this.selectedProduct.size,
        "productQty": this.quantity,
        "quantity": this.selectedProduct.qty,
        "unit": this.selectedProduct.unit,
        "price": this.selectedProduct.price,
        "amount": this.selectedProduct.price * this.quantity,
        "variantId": this.selectedProduct.id,
        "productName": this.product.name,
        "variant": [this.selectedProduct]
      }
      this.cartService.addToCart([data]).subscribe(res => {
        this.cartService.cartUpdateSubject.next(true)
        this.toastrService.success(res.message);
        this.quantity = 1
      })
    }
    else {
      let data = {
        "productId": Number(this.id),
        "size": this.selectedProduct.size,
        "productQty": this.quantity,
        "quantity": this.selectedProduct.qty,
        "unit": this.selectedProduct.unit,
        "price": this.selectedProduct.price,
        "amount": this.selectedProduct.price * this.quantity,
        "variantId": this.selectedProduct.id,
        "productName": this.product.name,
        "variant": [this.selectedProduct]
      }
      let tempCart: any = this.storageService.getItem('cart')
      let updatedCart = JSON.parse(tempCart)
      updatedCart.push(data)
      this.storageService.setItem('cart', JSON.stringify(updatedCart))
      this.cartService.cartUpdateSubject.next(true)
      this.toastrService.success('Successfully added products to cart.');
      this.quantity = 1;
    }
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe(res => {
      this.productsList = res.data;
      let filteredProducts = this.productsList.filter(item => item.id != this.id);
      this.productsList = filteredProducts
    })
  }
}
