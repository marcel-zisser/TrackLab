import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/']); // Navigates back to dashboard
  }

  return isAuthenticated;
};
