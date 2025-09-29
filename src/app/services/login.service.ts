import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient, private storageService: StorageService) { }
  isLoggedIn() {
    return !!this.storageService.getItem('token');
  }
  login(data: any): Observable<any> {
    return this.http.post(`/api/Auth/Login`, data);
  }
  registerUser(data: any): Observable<any> {
    return this.http.post(`/api/User/Register`, data);
  }
  updateUser(data: any): Observable<any> {
    return this.http.post(`/api/User/Update`, data);
  }
  getUserById(data: any): Observable<any> {
    return this.http.post(`/api/User/GetById`, data);
  }
}
