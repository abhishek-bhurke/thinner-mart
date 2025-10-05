import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputOtpModule } from 'primeng/inputotp';
import { LoginService } from '../../services/login.service';
import { EnterPasswordComponent } from '../enter-password/enter-password.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-enter-otp',
  imports: [MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, InputOtpModule, MatDialogModule, TranslateModule],
  templateUrl: './enter-otp.component.html',
  styleUrl: './enter-otp.component.scss'
})
export class EnterOtpComponent {
  otp: string = '';
  constructor(public matdialogRef: MatDialogRef<EnterOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) { }
  validateOTP() {
    let data = {
      "email_Mobile": this.data.email_Mobile,
      "otp": Number(this.otp)
    }
    this.loginService.validateForgotPasswordOtp(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.matdialogRef.close();
      let matDialogRef = this.matDialog.open(EnterPasswordComponent, {
        height: 'auto',
        width: 'auto',
        disableClose: true,
        panelClass: 'login-dialog-container',
        // backdropClass: 'glass-backdrop',
        autoFocus: false,
        data: data
      });
      matDialogRef.afterClosed().subscribe(res => {

      })
    })
  }
}
