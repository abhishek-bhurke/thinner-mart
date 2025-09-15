import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { banner, benefitsBanner, mobBanner, mobBenefitsBanner, topProducts } from './banner';
import { RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: 'app-home',
  imports: [CarouselModule, CommonModule, RouterLink, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    let innerWidth = window.innerWidth;
    if (innerWidth >= 510) {
      this.banners = banner
      this.benefitsBanner = benefitsBanner
    }
    else {
      this.banners = mobBanner
      this.benefitsBanner = mobBenefitsBanner
    }
  }
  responsiveOptions: any[] = [];
  banners: any[] = [];
  benefitsBanner: any;
  topProducts: any;
  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
    if (typeof window !== 'undefined') {
      this.onResize()
    }
    this.topProducts = topProducts
  }
}
