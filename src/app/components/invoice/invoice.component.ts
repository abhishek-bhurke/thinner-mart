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
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule, TranslateModule, MatSelectModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  invoiceForm!: FormGroup;
  orderNumber: any;
  constructor(private fb: FormBuilder, private adminService: AdminService, private toastrService: ToastrService, private router: Router) { }
  ngOnInit() {
    this.createInvoiceForm();
    this.getInvoiceNumbers();
  }
  createInvoiceForm() {
    this.invoiceForm = this.fb.group({
      'orderNumber': ['', Validators.required]
    })
  }
  getInvoiceNumbers() {
    this.adminService.getOrderNumber().subscribe(res => {
      this.orderNumber = res.data;
      this.invoiceForm.controls['orderNumber'].setValue(this.orderNumber.orderNumber)
    })
  }
  updateInvoice() {
    let data = {
      "id": Number(this.orderNumber.id),
      "number": Number(this.invoiceForm.controls['orderNumber'].value)
    }
    this.adminService.updateOrderNumber(data).subscribe(res => {
      this.toastrService.success(res.message);
      this.router.navigate(['admin'])
    })
  }
}
