import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule, MatDialogModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isCollapse: boolean = false;
  activeSection: string = 'home';
  cartItems: any[] = [1];
  isLoggedIn: boolean = false;
  constructor(private eRef: ElementRef, private router: Router, private dialog: MatDialog, private loginService: LoginService, private storageService: StorageService) {
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
    })
  }
  ngOnInit() {
    this.routeChange();
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
      default:
        this.activeSection = '';
        break;
    }
    this.closeMenu()
  }
  openLoginDialog() {
    let dialogRef = this.dialog.open(LoginComponent, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      panelClass: 'login-dialog-container',
      // backdropClass: 'glass-backdrop',
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(res => {

    })
  }
  viewCart() {
    this.router.navigate(['cart']);
  }
  logout() {
    this.storageService.clear();
    this.loginService.isLoggedInSubject.next(false);
    this.router.navigate([''])
  }
}
