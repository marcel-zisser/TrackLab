import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { catchError, switchMap } from 'rxjs/operators';

export function authenticationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthenticationService);

  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/auth')) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            if (response?.accessToken) {
              authService.saveToken(response?.accessToken);
            }

            const clonedReq = req.clone(
              {
                setHeaders: {
                  Authorization: `Bearer ${response?.accessToken}`
                }
              }
            );
            return next(clonedReq);
          })
        );
      }
      throw error;
    })
  );
}
