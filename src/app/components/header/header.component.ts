import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environments/environment';
import { TranslationService } from '../../services/translation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule, MatDialogModule, CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isCollapse: boolean = false;
  activeSection: string = 'home';
  cartItems: any[] = [];
  isLoggedIn: any = false;
  totalPrice: number = 0;
  productQuantity: number = 0;
  baseUrl = environment.API_URL;
  whatsappNumber = 8452006089;
  language: string = 'en';
  userData: any;
  constructor(private eRef: ElementRef,
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
    private storageService: StorageService,
    private cartService: CartService,
    private translateService: TranslateService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (typeof window !== 'undefined') {
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }
        this.routeChange();
      }
    });
    this.loginService.isLoggedIn$.subscribe((res: any) => {
      if (this.loginService.isLoggedIn()) {
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
      let data: any = this.storageService.getItem('userData');
      this.userData = JSON.parse(data);
    })
    this.cartService.cartUpdate$.subscribe(res => {
      if (res) {
        this.getCart()
      }
    });
    const savedLang: any = this.storageService.getItem('app_lang')
    this.language = savedLang || 'en';
    this.translateService.addLangs(['en', 'hi']);
    this.translateService.setFallbackLang('en');
    const browserLang: any = savedLang || this.translateService.getBrowserLang();
    this.translateService.use(['en', 'hi'].includes(browserLang) ? browserLang : 'en');
  }
  ngOnInit() {
    this.routeChange();
    this.getCart();
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.isCollapse && !this.eRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
  closeMenu() {
    this.isCollapse = false;
  }
  routeChange() {
    let route = this.router.url;
    switch (route) {
      case '/':
        this.activeSection = 'home';
        break;
      case '/about-us':
        this.activeSection = 'about-us';
        break;
      case '/products':
        this.activeSection = 'products';
        break;
      case '/orders':
        this.activeSection = 'orders';
        break;
      case '/admin':
        this.activeSection = 'admin';
        break;
      default:
        this.activeSection = '';
        break;
    }
    this.closeMenu()
  }
  openLoginDialog(redirect?: boolean) {
    let dialogRef = this.dialog.open(LoginComponent, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      panelClass: 'login-dialog-container',
      // backdropClass: 'glass-backdrop',
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res && redirect) {
        this.redirectToCheckout();
      }
    })
  }
  viewCart() {
    this.router.navigate(['cart']);
  }
  logout() {
    this.storageService.clear();
    this.loginService.isLoggedInSubject.next(false);
    this.router.navigate([''])
    let emptyCart: any = []
    this.storageService.setItem('cart', JSON.stringify(emptyCart))
    this.getCart();
  }
  getCart() {
    if (this.loginService.isLoggedIn()) {
      this.cartService.getAllCart().subscribe(res => {
        this.cartItems = res.data;
        this.totalPrice = 0;
        this.productQuantity = 0;
        this.cartItems.forEach((ele: any) => {
          let productprice = 0
          ele.variant?.forEach((ele1: any) => {
            if (ele1?.image?.includes('/var/TNMart/Deployable/wwwroot/')) {
              let image = ele1?.image?.replace('/var/TNMart/Deployable/wwwroot/', '');
              ele1.image = image;
            }
            productprice += ele1.qty * ele1.price;
          })
          this.totalPrice += ele.productQty * productprice;
          this.productQuantity += ele.productQty;
        })
        //(qty * price) * productQty
      })
    }
    else {
      let cart: any = this.storageService.getItem('cart');
      this.cartItems = JSON.parse(cart);
      this.totalPrice = 0;
      this.productQuantity = 0;
      this.cartItems.forEach((ele: any) => {
        let productprice = 0
        ele.variant?.forEach((ele1: any) => {
          if (ele1.image.includes('/var/TNMart/Deployable/wwwroot/')) {
            let image = ele1.image.replace('/var/TNMart/Deployable/wwwroot/', '');
            ele1.image = image;
          }
          productprice += ele1.qty * ele1.price;
        })
        this.totalPrice += ele.productQty * productprice;
        this.productQuantity += ele.productQty;
      })
    }
  }
  removeFromCart(index: any) {
    if (this.loginService.isLoggedIn()) {
      let data = {
        id: Number(this.cartItems[index].id)
      }
      this.cartService.deleteCart(data).subscribe(res => {
        this.getCart();
      })
    }
    else {
      this.cartItems.splice(index, 1);
      this.storageService.setItem('cart', JSON.stringify(this.cartItems));
      this.getCart();
    }
  }
  redirectToCheckout() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['checkout']);
    }
    else {
      this.openLoginDialog(true);
    }
  }
  goToProducts() {
    this.router.navigate(['products']);
  }
  redirectToWhatsapp() {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank');
  }
  redirectToFacebook() {
    const url = 'https://www.facebook.com/share/1AKLUyzj6V/';
    window.open(url, '_blank')
  }
  switchLang(event: any) {
    this.translateService.use(event);
    this.storageService.setItem('app_lang', event);
  }
}
