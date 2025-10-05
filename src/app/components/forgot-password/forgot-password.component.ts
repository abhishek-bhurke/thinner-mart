import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { EnterOtpComponent } from '../enter-otp/enter-otp.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatDialogModule, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  constructor(public matdialogRef: MatDialogRef<ForgotPasswordComponent>,
    private fb: FormBuilder,
    private loginService: LoginService,
    private matdialog: MatDialog,
    private toastrService: ToastrService) { }
  ngOnInit() {
    this.createForgotPasswordForm();
  }
  createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      'emailormobile': ['', Validators.required]
    })
  }
  getOTP() {
    let data = {
      "email_Mobile": this.forgotPasswordForm.controls['emailormobile'].value
    }
    this.loginService.forgotPasswordGetOtp(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.matdialogRef.close();
      let matdialogRef = this.matdialog.open(EnterOtpComponent, {
        height: 'auto',
        width: 'auto',
        disableClose: true,
        panelClass: 'login-dialog-container',
        // backdropClass: 'glass-backdrop',
        autoFocus: false,
        data: data
      });
      matdialogRef.afterClosed().subscribe(res => {

      })
    })
  }
}
