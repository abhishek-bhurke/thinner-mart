import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CouponService } from '../../services/coupon.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coupons-list',
  imports: [TranslateModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule],
  templateUrl: './coupons-list.component.html',
  styleUrl: './coupons-list.component.scss'
})
export class CouponsListComponent {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'code', 'percentage', 'minimumAmount', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private couponService: CouponService, private router: Router, private matDialog: MatDialog, private toastrService: ToastrService) { }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.getAllProducts();
  }
  getAllProducts() {
    this.couponService.getAllCoupons().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
    })
  }

  editCoupon(id: any) {
    this.router.navigate(['add-edit-coupon'], { queryParams: { id: id } });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addNewCoupon() {
    this.router.navigate(['add-edit-coupon'])
  }
  deleteCoupon(id: any) {
    let dialogRef = this.matDialog.open(DeleteConfirmationComponent, {
      data: { message: 'Are you sure you want to delete the selected coupon?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.couponService.deleteCoupon({ id }).subscribe(res => {
          this.toastrService.success(res.message);
          this.getAllProducts();
        })
      }
    })
  }
}
