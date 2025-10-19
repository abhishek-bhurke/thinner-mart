import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FileSelectEvent, FileUpload, UploadEvent } from 'primeng/fileupload';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-product',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule, TranslateModule, MatSelectModule, FileUpload],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.scss'
})
export class AddEditProductComponent {
  id: any;
  productData: any;
  productForm!: FormGroup;
  arr!: FormArray;
  application!: FormArray;
  applicationMethod!: FormArray;
  benefit!: FormArray;
  storageHandeling!: FormArray;
  precaution!: FormArray;
  categoryList: any;
  productImageList: any[] = [];
  baseUrl = environment.API_URL;
  variantImages: any[] = [];
  constructor(private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder, private toastrService: ToastrService, private router: Router, private http: HttpClient) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.getCategoryList();
      this.createProductForm();
      if (this.id) {
        this.getProductById();
      }
    })
  }
  getProductById() {
    let data = {
      id: Number(this.id)
    }
    this.productService.getProductById(data).subscribe(res => {
      this.productData = res.data;
      this.productForm.patchValue({
        'category': this.productData.categoryId,
        'name': this.productData.name,
        'description': this.productData.description
      })
      let image = this.productData.image.replace('/var/TNMart/Deployable/wwwroot', '')
      this.urlToBlob(image)
      this.productData?.variety.forEach((ele: any, index: any) => {
        this.getControls.push(this.fb.group(ele));
        let image = ele.image.replace('/var/TNMart/Deployable/wwwroot', '')
        this.urlToBlobVariant(image, index)
      });
      this.productData?.application.forEach((ele: any) => {
        this.getApplicationControls.push(this.fb.group(ele));
      });
      this.productData?.applicationMethod.forEach((ele: any) => {
        this.getApplicationMethodControls.push(this.fb.group(ele));
      });
      this.productData?.benifits.forEach((ele: any) => {
        this.getBenefitControls.push(this.fb.group(ele));
      });
      this.productData?.precautions.forEach((ele: any) => {
        this.getPrecautionControls.push(this.fb.group(ele));
      });
      this.productData?.storageHandelling.forEach((ele: any) => {
        this.getStorageHandelingControls.push(this.fb.group(ele));
      });
    })
  }
  createProductForm() {
    this.productForm = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      variety: this.fb.array([]),
      application: this.fb.array([]),
      applicationMethod: this.fb.array([]),
      benefit: this.fb.array([]),
      storageHandeling: this.fb.array([]),
      precaution: this.fb.array([]),
    })
  }
  createVariety() {
    return this.fb.group({
      "size": [''],
      "unit": [''],
      "price": [''],
      "stock": [''],
      "image": [''],
      "qty": ['']
    });
  }
  createNewMethods() {
    return this.fb.group({
      'description': ['']
    })
  }
  get f() {
    return this.productForm.controls;
  }
  get getControls(): FormArray {
    return this.productForm.get('variety') as FormArray;
  }
  get getApplicationControls(): FormArray {
    return this.productForm.get('application') as FormArray;
  }
  get getApplicationMethodControls(): FormArray {
    return this.productForm.get('applicationMethod') as FormArray;
  }
  get getBenefitControls(): FormArray {
    return this.productForm.get('benefit') as FormArray;
  }
  get getStorageHandelingControls(): FormArray {
    return this.productForm.get('storageHandeling') as FormArray;
  }
  get getPrecautionControls(): FormArray {
    return this.productForm.get('precaution') as FormArray;
  }

  addVariety() {
    this.arr = this.f['variety'] as FormArray;
    this.arr.push(this.createVariety());
  }
  addMethod(name: string) {
    let arr = this.f[name] as FormArray;
    arr.push(this.createNewMethods());
  }
  removeVariety(index: any) {
    (this.f['variety'] as FormArray).removeAt(index);
  }
  removeMethod(index: any, name: string) {
    (this.f[name] as FormArray).removeAt(index);
  }
  getCategoryList() {
    this.productService.getCategories().subscribe(res => {
      this.categoryList = res.data;
    })
  }
  addUpdateProduct() {
    if (this.id) {
      let data: any = {
        'id': Number(this.id),
        'name': this.productForm.controls['name'].value,
        'categoryId': this.productForm.controls['category'].value,
        'description': this.productForm.controls['description'].value,
        'variety': this.productForm.get('variety')?.value ? this.productForm.get('variety')?.value : [],
        'application': this.productForm.get('application')?.value ? this.productForm.get('application')?.value : [],
        'applicationMethod': this.productForm.get('applicationMethod')?.value ? this.productForm.get('applicationMethod')?.value : [],
        'benefit': this.productForm.get('benefit')?.value ? this.productForm.get('benefit')?.value : [],
        'storageHandeling': this.productForm.get('storageHandeling')?.value ? this.productForm.get('storageHandeling')?.value : [],
        'precaution': this.productForm.get('precaution')?.value ? this.productForm.get('precaution')?.value : [],
      }
      let formData = new FormData();
      formData.append('Id', data.id);
      formData.append('Name', data.name);
      formData.append('CategoryId', data.categoryId);
      formData.append('Description', data.description);
      if (this.productImageList.length)
        formData.append('Image', this.productImageList[0]);
      // formData.append('Variety', JSON.stringify(data.variety));
      // formData.append('Application', JSON.stringify(data.application));
      // formData.append('ApplicationMethod', JSON.stringify(data.applicationMethod));
      // formData.append('Benefit', JSON.stringify(data.benefit));
      // formData.append('StorageHandeling', JSON.stringify(data.storageHandeling));
      // formData.append('Precaution', JSON.stringify(data.precaution));
      data.variety?.forEach((item: any, index: any) => {
        formData.append(`Variety[${index}].Size`, item.size.toString());
        formData.append(`Variety[${index}].Unit`, item.unit);
        formData.append(`Variety[${index}].Price`, item.price.toString());
        formData.append(`Variety[${index}].Stock`, item.stock.toString());
        formData.append(`Variety[${index}].Qty`, item.qty.toString());
        formData.append(`Variety[${index}].Image`, this.variantImages[index]);

        // if (item.imageFiles) {
        //   for (let file of item.imageFiles) {
        //     formData.append(`Variety[${index}].Image`, file);
        //   }
        // }
      });
      data.application?.forEach((item: any, index: any) => {
        formData.append(`Application[${index}].Description`, item.description.toString());
      });
      data.applicationMethod?.forEach((item: any, index: any) => {
        formData.append(`ApplicationMethod[${index}].Description`, item.description.toString());
      });
      data.benefit?.forEach((item: any, index: any) => {
        formData.append(`Benefit[${index}].Description`, item.description.toString());
      });
      data.storageHandeling?.forEach((item: any, index: any) => {
        formData.append(`StorageHandeling[${index}].Description`, item.description.toString());
      });
      data.precaution?.forEach((item: any, index: any) => {
        formData.append(`Precaution[${index}].Description`, item.description.toString());
      });
      this.productService.updateProduct(formData).subscribe(res => {
        this.toastrService.success(res.message);
        this.router.navigate(['product-list']);
      })
    }
    else {
      let data: any = {
        'name': this.productForm.controls['name'].value,
        'categoryId': this.productForm.controls['category'].value,
        'description': this.productForm.controls['description'].value,
        'variety': this.productForm.get('variety')?.value ? this.productForm.get('variety')?.value : [],
        'application': this.productForm.get('application')?.value ? this.productForm.get('application')?.value : [],
        'applicationMethod': this.productForm.get('applicationMethod')?.value ? this.productForm.get('applicationMethod')?.value : [],
        'benefit': this.productForm.get('benefit')?.value ? this.productForm.get('benefit')?.value : [],
        'storageHandeling': this.productForm.get('storageHandeling')?.value ? this.productForm.get('storageHandeling')?.value : [],
        'precaution': this.productForm.get('precaution')?.value ? this.productForm.get('precaution')?.value : [],
      }
      let formData = new FormData();
      formData.append('Name', data.name);
      formData.append('CategoryId', data.categoryId);
      formData.append('Description', data.description);
      if (this.productImageList.length)
        formData.append('Image', this.productImageList[0]);
      // formData.append('Variety', JSON.stringify(data.variety));
      // formData.append('Application', JSON.stringify(data.application));
      // formData.append('ApplicationMethod', JSON.stringify(data.applicationMethod));
      // formData.append('Benefit', JSON.stringify(data.benefit));
      // formData.append('StorageHandeling', JSON.stringify(data.storageHandeling));
      // formData.append('Precaution', JSON.stringify(data.precaution));
      data.variety?.forEach((item: any, index: any) => {
        formData.append(`Variety[${index}].Size`, item.size.toString());
        formData.append(`Variety[${index}].Unit`, item.unit);
        formData.append(`Variety[${index}].Price`, item.price.toString());
        formData.append(`Variety[${index}].Stock`, item.stock.toString());
        formData.append(`Variety[${index}].Qty`, item.qty.toString());
        formData.append(`Variety[${index}].Image`, this.variantImages[index]);

        // if (item.imageFiles) {
        //   for (let file of item.imageFiles) {
        //     formData.append(`Variety[${index}].Image`, file);
        //   }
        // }
      });
      data.application?.forEach((item: any, index: any) => {
        formData.append(`Application[${index}].Description`, item.description.toString());
      });
      data.applicationMethod?.forEach((item: any, index: any) => {
        formData.append(`ApplicationMethod[${index}].Description`, item.description.toString());
      });
      data.benefit?.forEach((item: any, index: any) => {
        formData.append(`Benefit[${index}].Description`, item.description.toString());
      });
      data.storageHandeling?.forEach((item: any, index: any) => {
        formData.append(`StorageHandeling[${index}].Description`, item.description.toString());
      });
      data.precaution?.forEach((item: any, index: any) => {
        formData.append(`Precaution[${index}].Description`, item.description.toString());
      });
      this.productService.addProduct(formData).subscribe(res => {
        this.toastrService.success(res.message);
        this.router.navigate(['product-list']);
      })
    }
  }
  cancel() {
    this.router.navigate(['product-list']);
  }
  onUpload(event: FileSelectEvent) {
    this.productImageList = event.currentFiles;
  }
  onUploadVariant(event: FileSelectEvent, index: any) {
    this.variantImages[index] = event.currentFiles;
  }
  cancelProductImage() {
    this.productImageList = [];
  }
  cancelVariantImage(index: any) {
    this.variantImages[index] = null;
  }
  urlToBlob(url: string) {
    let imageUrl = '/' + url;
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const file = new File([blob], url, { type: blob.type });
      this.productImageList = [file];
    })
  }
  urlToBlobVariant(url: string, index: any) {
    let imageUrl = '/' + url;
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const file = new File([blob], url, { type: blob.type });
      this.variantImages[index] = [file];
    })
  }
}
