import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  return authService.isAuthenticated();
};
