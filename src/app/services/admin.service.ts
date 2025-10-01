import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getAllAdminOrders(): Observable<any> {
    return this.http.post(`/api/Admin/GetAllOrders`, '');
  }
  getAdminOrderById(data: any): Observable<any> {
    return this.http.post(`/api/Admin/GetOrderById`, data);
  }
  updateOrderStatus(data: any): Observable<any> {
    return this.http.post(`/api/Admin/UpdateOrderStatus`, data);
  }
}
