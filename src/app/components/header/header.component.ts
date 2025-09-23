import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule, MatDialogModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isCollapse: boolean = false;
  activeSection: string = 'home';
  cartItems: any[] = [1]
  constructor(private eRef: ElementRef, private router: Router, private dialog: MatDialog) {
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
}
