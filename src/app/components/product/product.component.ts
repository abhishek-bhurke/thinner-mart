import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ZoomProductComponent } from './zoom-product/zoom-product.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CommonModule, MatIconModule, InputNumberModule, FormsModule, TabsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
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
  selectedIndex: any = '';
  quantity: number = 1
  activeTab: 'description' | 'info' = 'description';

  constructor(private matDialog: MatDialog, private router: Router) { }
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
  }

  setTab(tab: 'description' | 'info') {
    this.activeTab = tab;
  }
  redirectToProduct() {
    this.router.navigate(['product'], { queryParams: { id: 0 } })
  }
}
