import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdvanceAmountConfirmationComponent } from './advance-amount-confirmation/advance-amount-confirmation.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule, MatCheckboxModule, MatIconModule, MatRadioModule, MatDialogModule, TooltipModule, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  productList: any[] = [];
  baseUrl = environment.API_URL;
  couponCode: string = '';
  subTotal: number = 0;
  total: number = 0;
  checkoutForm!: FormGroup;
  advancedAmount: number = 0;
  discountedTotal: number = 0;
  priceBeforeDiscount: number = 0;
  userId: any;
  constructor(private storageService: StorageService,
    private loginService: LoginService,
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private dialog: MatDialog) { }
  ngOnInit() {
    this.getCart();
    this.createCheckoutForm();
    this.getUserDetails();
    let userData: any = this.storageService.getItem('userData');
    this.userId = JSON.parse(userData)
  }
  getCart() {
    this.cartService.getAllCart().subscribe(res => {
      if (res.data.length) {
        this.productList = res.data;
        this.subTotal = 0;
        this.total = 0;
        this.priceBeforeDiscount = 0;
        this.productList.forEach((ele: any) => {
          let productprice = 0;
          ele.variant?.forEach((ele1: any) => {
            if (ele1.image.includes('/var/TNMart/Deployable/wwwroot/')) {
              let image = ele1.image.replace('/var/TNMart/Deployable/wwwroot/', '');
              ele1.image = image;
            }
            productprice += ele1.qty * ele1.price;
          })
          this.subTotal += ele.productQty * productprice;
          this.total += ele.productQty * productprice;
          this.priceBeforeDiscount += ele.productQty * productprice;
        })
      }
      else {
        this.router.navigate([''])
      }
    })
  }
  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      'emailId': ['', Validators.required],
      'country': [{ value: 'India', disabled: true }, Validators.required],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': [''],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'postalCode': ['', Validators.required],
      'mobile': ['', Validators.required],
      'note': [''],
      'paymentMode': ['', Validators.required],
      'addNote': [false],
      'isGST': [false],
      'gstNumber': ['']
    })
  }
  isGstRequired(event: MatCheckboxChange) {
    if (event.checked) {
      this.checkoutForm.controls['gstNumber'].setValue('')
      this.checkoutForm.controls['gstNumber'].addValidators(Validators.required);
      this.checkoutForm.controls['gstNumber'].updateValueAndValidity();
      this.checkoutForm.updateValueAndValidity();
    }
    else {
      this.checkoutForm.controls['gstNumber'].setValue('')
      this.checkoutForm.controls['gstNumber'].removeValidators(Validators.required);
      this.checkoutForm.controls['gstNumber'].updateValueAndValidity();
      this.checkoutForm.updateValueAndValidity();
    }
  }
  placeOrder() {
    if (this.productList.length == 1 && this.productList[0].categoryName == 'Sample') {
      if (this.checkoutForm.controls['paymentMode'].value == 'cod') {
        this.toastrService.error('Cash on Delivery (COD) is not available for selected product.');
      }
      else {
        this.advancedAmount = this.total;
        this.placeOrderFunc(false);
      }
    }
    else {
      if (this.total >= 4999) {
        if (this.checkoutForm.controls['paymentMode'].value == 'cod') {
          if (this.checkoutForm.controls['city'].value.toLowerCase().includes('mumbai') || this.checkoutForm.controls['city'].value.toLowerCase().includes('thane')) {
            if (this.total > 10999) {
              this.advancedAmount = (this.total / 10) > 3000 ? 3000 : (this.total / 10);
              let dialogRef = this.dialog.open(AdvanceAmountConfirmationComponent, {
                data: {
                  advancedAmount: this.advancedAmount,
                  total: this.total
                },
                height: 'auto',
                width: 'auto',
                disableClose: true,
              })
              dialogRef.afterClosed().subscribe(res => {
                if (res)
                  this.placeOrderFunc(true);
              })
            }
            else {
              this.advancedAmount = this.total;
              this.placeOrderFunc(false);
            }
          }
          else {
            this.toastrService.error('Cash on Delivery (COD) is not available in your city. Please try different method.');
          }
        }
        else {
          this.advancedAmount = this.total;
          this.placeOrderFunc(false);
        }
      }
      else {
        this.toastrService.error('Minimum order value must be ₹4,999.')
      }
    }
  }
  placeOrderFunc(isAdvance?: boolean) {
    let data = {
      "totalAmount": this.total,
      "orderItems": this.productList,
      "method": this.checkoutForm.controls['paymentMode'].value,
      "address1": this.checkoutForm.controls['address1'].value,
      "address2": this.checkoutForm.controls['address2'].value,
      "pinCode": this.checkoutForm.controls['postalCode'].value,
      "mobile": this.checkoutForm.controls['mobile'].value,
      "email": this.checkoutForm.controls['emailId'].value,
      "note": this.checkoutForm.controls['note'].value,
      "firstName": this.checkoutForm.controls['firstName'].value,
      "lastName": this.checkoutForm.controls['lastName'].value,
      "country": this.checkoutForm.controls['country'].value,
      "advanceAmount": this.advancedAmount,
      "isAdvance": isAdvance ? true : false,
      "gstNumber": this.checkoutForm.controls['gstNumber'].value ? this.checkoutForm.controls['gstNumber'].value : '',
      "totalBeforeDiscount": this.priceBeforeDiscount,
      "couponCode": this.couponCode,
      "discountAmount": this.discountedTotal,
      "city": this.checkoutForm.controls['city'].value,
      "state": this.checkoutForm.controls['state'].value
    }
    this.orderService.addOrder(data).subscribe(res => {
      if (data.method == 'online' || isAdvance) {
        let resData = JSON.parse(res.data)
        let data = {
          "key": environment.razorPay_key,
          "amount": resData.Attributes.amount,
          "currency": resData.Attributes.currency,
          "name": "Thinner Mart",
          "description": "Test Transaction",
          "order_id": resData.Attributes.id,
          "handler": (res: any) => {
            this.verifyPayment(res);
          },
          "prefill": {
            "name": this.checkoutForm.controls['firstName'].value + ' ' + this.checkoutForm.controls['lastName'].value,
            "email": this.checkoutForm.controls['emailId'].value,
            "contact": this.checkoutForm.controls['mobile'].value
          },
          "theme": { "color": "#357089" }
        }
        const rzp = new Razorpay(data);
        rzp.open();
      }
      else {
        this.toastrService.success(res.message)
        this.router.navigate(['orders']);
      }
    })
  }
  verifyPayment(res: any) {
    let data = {
      "razorpayPaymentId": res.razorpay_payment_id,
      "razorpayOrderId": res.razorpay_order_id,
      "razorpaySignature": res.razorpay_signature
    }
    this.paymentService.verifyPayment(data).subscribe(res => {
      this.toastrService.success(res.message)
      this.router.navigate(['orders']);
    })
  }
  goToCart() {
    this.router.navigate(['cart'])
  }
  getUserDetails() {
    this.loginService.getUserById({ id: 0 }).subscribe(res => {
      this.checkoutForm.controls['firstName'].setValue(res.data.firstName)
      this.checkoutForm.controls['lastName'].setValue(res.data.lastName)
      this.checkoutForm.controls['emailId'].setValue(res.data.emailId)
      this.checkoutForm.controls['address1'].setValue(res.data.address1)
      this.checkoutForm.controls['address2'].setValue(res.data.address2)
      this.checkoutForm.controls['city'].setValue(res.data.city)
      this.checkoutForm.controls['state'].setValue(res.data.state)
      this.checkoutForm.controls['postalCode'].setValue(res.data.pincode)
      this.checkoutForm.controls['mobile'].setValue(res.data.mobileNumber)
    })
  }
  applyCoupon() {
    let data = {
      code: this.couponCode,
      id: Number(this.userId.id)
    }
    this.orderService.verifyCoupon(data).subscribe((res: any) => {
      if (res?.data) {
        if (this.total >= res.data?.minimumAmount) {
          this.discountedTotal = (this.total * res.data?.percentage) / 100;
          let newTotal = this.total - this.discountedTotal;
          this.priceBeforeDiscount = this.total;
          this.total = newTotal;
          this.toastrService.success(`Coupon applied successfully.`)
        }
        else {
          this.toastrService.error(`Coupon is valid only above ₹${res.data?.minimumAmount} amount.`)
        }
      }
    })
  }
  removeCoupon() {
    this.discountedTotal = 0;
    this.couponCode = '';
    this.getCart();
  }
}
