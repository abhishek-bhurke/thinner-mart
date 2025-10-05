import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputOtpModule } from 'primeng/inputotp';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-enter-password',
  imports: [MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, InputOtpModule, MatDialogModule, TranslateModule],
  templateUrl: './enter-password.component.html',
  styleUrl: './enter-password.component.scss'
})
export class EnterPasswordComponent implements OnInit {
  enterPasswordForm!: FormGroup;
  hide1 = signal(true);
  hide2 = signal(true);
  constructor(public matdialogRef: MatDialogRef<EnterPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private loginService: LoginService,
    private fb: FormBuilder,
    private toastrService: ToastrService) { }
  ngOnInit() {
    this.createPasswordForm();
  }
  changePassword() {
    let data = {
      "email_Mobile": this.data.email_Mobile,
      "password": this.enterPasswordForm.controls['password'].value,
      "confirmPassword": this.enterPasswordForm.controls['confirmPassword'].value
    }
    this.loginService.resetPassword(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.matdialogRef.close();
    })
  }
  clickEvent1(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }
  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
    event.stopPropagation();
  }
  createPasswordForm() {
    this.enterPasswordForm = this.fb.group({
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    });
  }
}
