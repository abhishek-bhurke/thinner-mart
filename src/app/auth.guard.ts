import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { LoginService } from './services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const isLoggedIn = loginService.isLoggedIn();
  return isLoggedIn ? true : router.navigate(['']);
};
