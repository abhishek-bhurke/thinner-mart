import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  getAllOrders(): Observable<any> {
    return this.http.post(`/api/Order/GetAll`, '');
  }
  getOrderById(data: any): Observable<any> {
    return this.http.post(`/api/Order/GetById`, data);
  }
  addOrder(data: any): Observable<any> {
    return this.http.post(`/api/Order/Add`, data);
  }
  updateOrder(data: any): Observable<any> {
    return this.http.post(`/api/Order/Update`, data);
  }
  deleteOrder(data: any): Observable<any> {
    return this.http.post(`/api/Order/Delete`, data);
  }
}
