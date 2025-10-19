import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CouponService } from '../../services/coupon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-coupon',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule, TranslateModule, MatSelectModule],
  templateUrl: './add-edit-coupon.component.html',
  styleUrl: './add-edit-coupon.component.scss'
})
export class AddEditCouponComponent {
  id: any;
  couponForm!: FormGroup;
  constructor(private route: ActivatedRoute, private couponService: CouponService, private fb: FormBuilder, private toastrService: ToastrService, private router: Router) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.createProductForm();
      if (this.id) {
        this.getCouponById();
      }
    })
  }
  createProductForm() {
    this.couponForm = this.fb.group({
      'code': ['', Validators.required],
      'minimumAmount': ['', Validators.required],
      'percentage': ['', Validators.required]
    })
  }
  getCouponById() {
    let data = {
      id: Number(this.id)
    }
    this.couponService.getCouponById(data).subscribe(res => {
      this.couponForm.patchValue(res.data);
    })
  }
  addUpdateCoupon() {
    if (this.id) {
      let data = {
        "id": Number(this.id),
        "coupon": this.couponForm.controls['code'].value,
        "percentage": Number(this.couponForm.controls['percentage'].value),
        "minimumAmount": Number(this.couponForm.controls['minimumAmount'].value)
      }
      this.couponService.updateCoupon(data).subscribe(res => {
        this.toastrService.success(res.message);
        this.router.navigate(['coupons-list'])
      })
    }
    else {
      let data = {
        "coupon": this.couponForm.controls['code'].value,
        "percentage": Number(this.couponForm.controls['percentage'].value),
        "minimumAmount": Number(this.couponForm.controls['minimumAmount'].value)
      }
      this.couponService.addCoupon(data).subscribe(res => {
        this.toastrService.success(res.message);
        this.router.navigate(['coupons-list'])
      })
    }
  }
}
