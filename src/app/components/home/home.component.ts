import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { banner, benefitsBanner, featureItemImages, mobBanner, mobBenefitsBanner, topProducts } from './banner';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { TooltipModule } from 'primeng/tooltip';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, CommonModule, RouterLink, MatIconModule, TooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    let innerWidth = window.innerWidth;
    if (innerWidth >= 510) {
      this.banners = banner;
      this.benefitsBanner = benefitsBanner;
      this.showFeatureCarousel = false;
    }
    else {
      this.banners = mobBanner;
      this.benefitsBanner = mobBenefitsBanner;
      this.showFeatureCarousel = true;
    }
  }
  responsiveOptions: any[] = [];
  banners: any[] = [];
  benefitsBanner: any;
  topProducts: any;
  productsList: any[] = [];
  baseUrl = environment.API_URL;
  showFeatureCarousel: boolean = false;
  featureItemImages = featureItemImages;
  constructor(private router: Router, private productService: ProductService) { }
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
    this.topProducts = topProducts;
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
