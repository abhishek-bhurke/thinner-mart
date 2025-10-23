import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { InputNumberModule } from "primeng/inputnumber";
import { LoginService } from '../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule, MatIconModule, InputNumberModule, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  couponCode: string = '';
  productList: any[] = [];
  baseUrl = environment.API_URL;
  purchaseTotal: number = 0;
  constructor(private loginService: LoginService, private dialog: MatDialog, private storageService: StorageService,
    private cartService: CartService, private router: Router
  ) {
    this.cartService.cartUpdate$.subscribe(res => {
      if (res) {
        this.getCart()
      }
    })
  }
  ngOnInit() {
    this.getCart()
  }
  proceedToCheckout() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['checkout']);
    }
    else {
      let dialogRef = this.dialog.open(LoginComponent, {
        height: 'auto',
        width: 'auto',
        disableClose: true,
        panelClass: 'login-dialog-container',
        // backdropClass: 'glass-backdrop',
        autoFocus: false
      })
      dialogRef.afterClosed().subscribe(() => {

      })
    }
  }
  getCart() {
    if (this.loginService.isLoggedIn()) {
      this.cartService.getAllCart().subscribe(res => {
        this.productList = res.data
        this.purchaseTotal = 0;
        this.productList.forEach((ele: any) => {
          let productprice = 0
          ele.variant?.forEach((ele1: any) => {
            if (ele1.image.includes('/var/TNMart/Deployable/wwwroot/')) {
              let image = ele1.image.replace('/var/TNMart/Deployable/wwwroot/', '');
              ele1.image = image;
            }
            productprice += ele1.qty * ele1.price;
          })
          this.purchaseTotal += ele.productQty * productprice;
        })
      })
    }
    else {
      let cart: any = this.storageService.getItem('cart');
      this.productList = JSON.parse(cart);
      this.purchaseTotal = 0;
      this.productList.forEach((ele: any) => {
        let productprice = 0
        ele.variant?.forEach((ele1: any) => {
          if (ele1.image.includes('/var/TNMart/Deployable/wwwroot/')) {
            let image = ele1.image.replace('/var/TNMart/Deployable/wwwroot/', '');
            ele1.image = image;
          }
          productprice += ele1.qty * ele1.price;
        })
        this.purchaseTotal += ele.productQty * productprice;
      })
    }
  }
  removeItem(index: any) {
    if (this.loginService.isLoggedIn()) {
      let data = {
        id: Number(this.productList[index].id)
      }
      this.cartService.deleteCart(data).subscribe(res => {
        this.getCart();
        this.cartService.cartUpdateSubject.next(true)
      })
    }
    else {
      this.productList.splice(index, 1);
      this.storageService.setItem('cart', JSON.stringify(this.productList));
      this.getCart();
      this.cartService.cartUpdateSubject.next(true)
    }
  }
  updateCart(i: number, j: number) {
    if (this.loginService.isLoggedIn()) {
      let data = {
        "id": this.productList[i].id,
        "productId": this.productList[i].productId,
        "size": this.productList[i].size,
        "productQty": this.productList[i].productQty,
        "quantity": this.productList[i].quantity,
        "unit": this.productList[i].unit,
        "price": this.productList[i].price,
        "amount": this.productList[i].amount
      }
      this.cartService.updateCart(data).subscribe(res => {
        this.cartService.cartUpdateSubject.next(true)
      })
    }
    else {
      this.storageService.setItem('cart', JSON.stringify(this.productList));
      this.getCart();
      this.cartService.cartUpdateSubject.next(true)
    }
  }
  goToProducts() {
    this.router.navigate(['products']);
  }
}
