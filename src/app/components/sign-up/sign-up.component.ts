import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(public matdialogRef: MatDialogRef<SignUpComponent>, private fb: FormBuilder, private loginService: LoginService, private toastrService: ToastrService) { }
  ngOnInit() {
    this.createSignUpForm();
  }
  createSignUpForm() {
    this.signupForm = this.fb.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'mobileNumber': ['', Validators.required],
      'emailId': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': ['', Validators.required],
      'state': ['', Validators.required],
      'city': ['', Validators.required],
      'pincode': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }
  registerUser() {
    let data = {
      'firstName': this.signupForm.controls['firstName'].value,
      'lastName': this.signupForm.controls['lastName'].value,
      'mobileNumber': this.signupForm.controls['mobileNumber'].value,
      'emailId': this.signupForm.controls['emailId'].value,
      'address1': this.signupForm.controls['address1'].value,
      'address2': this.signupForm.controls['address2'].value,
      'state': this.signupForm.controls['state'].value,
      'city': this.signupForm.controls['city'].value,
      'pincode': this.signupForm.controls['pincode'].value,
      'password': this.signupForm.controls['password'].value
    }
    this.loginService.registerUser(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.matdialogRef.close('')
    })
  }
}
