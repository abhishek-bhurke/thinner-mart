import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isCollapse: boolean = false;
  activeSection: string = 'home'
  constructor(private eRef: ElementRef, private router: Router) {
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
}
