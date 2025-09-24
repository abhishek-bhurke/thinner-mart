import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { InputNumberModule } from "primeng/inputnumber";
import { LoginService } from '../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-cart',
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule, MatIconModule, InputNumberModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  couponCode: string = '';
  constructor(private loginService: LoginService, private dialog: MatDialog) { }
  proceedToCheckout() {
    if (this.loginService.isLoggedIn()) {

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
}
