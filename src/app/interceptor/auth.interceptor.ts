import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { StorageService } from '../services/storage.service';
import { LoaderService } from '../services/loader.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService)
  const loaderService = inject(LoaderService)
  const loginService = inject(LoginService)
  const toastrService = inject(ToastrService)
  const router = inject(Router)
  const token = storageService.getItem('token');
  loaderService.show();
  let cloned: HttpRequest<any>
  if (req.url.includes('assets'))
    cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, url: environment.FRONTEND_URL + req.url }) : req.clone({ url: environment.FRONTEND_URL + req.url });
  else
    cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, url: environment.API_URL + req.url }) : req.clone({ url: environment.API_URL + req.url });

  return next(cloned).pipe(
    catchError((error) => {
      switch (error.status) {
        case 401:
          storageService.clear();
          loginService.isLoggedInSubject.next(false);
          router.navigate([''])
          let emptyCart: any = []
          storageService.setItem('cart', JSON.stringify(emptyCart))
          toastrService.error('Session timeout.');
          break;
        case 400:
          toastrService.error(error?.error?.errorMessage);
          break;
        case 500:
          toastrService.error(error?.error?.errorMessage);
          break;
      }
      loaderService.hide();
      throw error
    }), finalize(() => {
      loaderService.hide();
    }));
};