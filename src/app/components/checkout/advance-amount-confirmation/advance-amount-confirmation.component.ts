import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-advance-amount-confirmation',
  imports: [CommonModule, MatIconModule],
  templateUrl: './advance-amount-confirmation.component.html',
  styleUrl: './advance-amount-confirmation.component.scss'
})
export class AdvanceAmountConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<AdvanceAmountConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  payNow() {
    this.dialogRef.close(true)
  }
}
