import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-zoom-product',
  imports: [CommonModule],
  templateUrl: './zoom-product.component.html',
  styleUrl: './zoom-product.component.scss'
})
export class ZoomProductComponent {
  isZoomed: boolean = false;
  isOpen: boolean = false;

  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  translateX = 0;
  translateY = 0;

  openModal() {
    this.isOpen = true;
    this.isZoomed = false;
    this.resetTransform();
  }

  closeModal() {
    this.isOpen = false;
    this.isZoomed = false;
    this.resetTransform();
  }

  toggleZoom(event: MouseEvent) {
    this.isZoomed = !this.isZoomed;
    if (!this.isZoomed) {
      this.resetTransform();
    }
    event.stopPropagation();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.isZoomed) return;
    this.isDragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    event.preventDefault();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isZoomed || !this.isDragging) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.translateX += dx;
    this.translateY += dy;
  }

  resetTransform() {
    this.translateX = 0;
    this.translateY = 0;
  }

  getTransformStyle(): string {
    const scale = this.isZoomed ? 2 : 1;
    return `scale(${scale}) translate(${this.translateX}px, ${this.translateY}px)`;
  }
}
