import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartUpdateSubject = new BehaviorSubject<boolean>(false);
  public cartUpdate$ = this.cartUpdateSubject.asObservable();
  constructor(private http: HttpClient, private storageService: StorageService) { }
  getAllCart(): Observable<any> {
    return this.http.post(`/api/Cart/GetAll`, '');
  }
  getCartById(data: any): Observable<any> {
    return this.http.post(`/api/Cart/GetById`, data);
  }
  addToCart(data: any): Observable<any> {
    return this.http.post(`/api/Cart/Add`, data);
  }
  updateCart(data: any): Observable<any> {
    return this.http.post(`/api/Cart/Update`, data);
  }
  deleteCart(data: any): Observable<any> {
    return this.http.post(`/api/Cart/Delete`, data);
  }
}
