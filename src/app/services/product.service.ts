import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  getAllProducts(): Observable<any> {
    return this.http.post(`/api/Product/GetAll`, '');
  }
  getProductById(data: any): Observable<any> {
    return this.http.post(`/api/Product/GetById`, data);
  }
  addProduct(data: any): Observable<any> {
    return this.http.post(`/api/Product/Add`, data);
  }
  updateProduct(data: any): Observable<any> {
    return this.http.post(`/api/Product/Update`, data);
  }
  deleteProduct(data: any): Observable<any> {
    return this.http.post(`/api/Product/Delete`, data);
  }
  getCategories(): Observable<any> {
    return this.http.post(`/api/Category/GetAll`, '');
  }
}
