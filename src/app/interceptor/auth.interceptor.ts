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

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService)
  const loaderService = inject(LoaderService)
  const token = storageService.getItem('token');
  loaderService.show();
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, url: environment.API_URL + req.url })
    : req.clone({ url: environment.API_URL + req.url });

  return next(cloned).pipe(
    catchError((error) => {
      loaderService.hide();
      throw error
    }), finalize(() => {
      loaderService.hide();
    }));
};