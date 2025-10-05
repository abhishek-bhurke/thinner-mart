import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(public matdialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private matdialog: MatDialog,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private router: Router,
    private cartService: CartService) { }
  ngOnInit() {
    this.createLoginForm()
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      'emailormobile': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }
  login() {
    let data = {
      'email_Mobile': this.loginForm.controls['emailormobile'].value,
      'password': this.loginForm.controls['password'].value
    }
    this.loginService.login(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.storageService.setItem('token', res.data.token);
      this.loginService.isLoggedInSubject.next(true)
      this.loginService.getUserById({ id: 0 }).subscribe(res => {
        this.storageService.setItem('userData', JSON.stringify(res.data));
      })
      let cart: any = this.storageService.getItem('cart');
      this.cartService.addToCart(JSON.parse(cart)).subscribe(res => { })
      this.cartService.cartUpdateSubject.next(true);
      this.matdialogRef.close(true);
    })
  }
  signUpPage() {
    let dialogRef = this.matdialog.open(SignUpComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'signup-dialog-container',
      // backdropClass: 'glass-backdrop',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {

    })
  }
  forgotPassword() {
    let dialogRef = this.matdialog.open(ForgotPasswordComponent, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      panelClass: 'login-dialog-container',
      // backdropClass: 'glass-backdrop',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {

    })
  }
}
