import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  addCoupon(data: any): Observable<any> {
    return this.http.post(`/api/Coupon/Add`, data);
  }
  updateCoupon(data: any): Observable<any> {
    return this.http.post(`/api/Coupon/Update`, data);
  }
  getCouponById(data: any): Observable<any> {
    return this.http.post(`/api/Coupon/GetById`, data);
  }
  deleteCoupon(data: any): Observable<any> {
    return this.http.post(`/api/Coupon/Delete`, data);
  }
  getAllCoupons(): Observable<any> {
    return this.http.post(`/api/Coupon/GetAll`, '');
  }
}
