import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
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
    private loginService: LoginService) { }
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

    })
    this.matdialogRef.close();
  }
  signUpPage() {
    let dialogRef = this.matdialog.open(SignUpComponent, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      panelClass: 'signup-dialog-container',
      // backdropClass: 'glass-backdrop',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {

    })
  }
}
