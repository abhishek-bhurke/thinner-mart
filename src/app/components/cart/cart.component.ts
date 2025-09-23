import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: 'app-cart',
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule, MatIconModule, InputNumberModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  couponCode: string = ''
}
