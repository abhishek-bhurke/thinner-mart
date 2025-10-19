import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  imports: [TranslateModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatDialogModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, AfterViewInit {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'category', 'description', 'price', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router, private matDialog: MatDialog, private toastrService: ToastrService) { }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.getAllProducts();
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editProduct(id: any) {
    this.router.navigate(['add-edit-product'], { queryParams: { id: id } });
  }
  addNewProduct() {
    this.router.navigate(['add-edit-product']);
  }
  deleteProduct(id: any) {
    let dialogRef = this.matDialog.open(DeleteConfirmationComponent, {
      data: { message: 'Are you sure you want to delete the selected product?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.productService.deleteProduct({ id }).subscribe(res => {
          this.toastrService.success(res.message);
          this.getAllProducts();
        })
      }
    })
  }
}
