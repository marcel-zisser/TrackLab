import { inject, Injectable, signal } from '@angular/core';
import { JwtTokenInformation, LoginRequest, LoginResponse, RefreshTokenResponse } from '@tracklab/models';
import { jwtDecode } from 'jwt-decode';
import { catchError, first, map, Observable, of } from 'rxjs';
import { ApiEndpoint, ApiRoutes, BackendService } from '../backend';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly backendService = inject(BackendService);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);

  private readonly _isAuthenticated = signal(false);

  /**
   * Returns a read-only signal to determine authentication status
   */
  get isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  /**
   * Logs in a user with the provided credentials
   * @param username the provided username
   * @param password the provided password
   * @returns {Observable<LoginResponse>} Observable with information about the success of the login
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username: username, password: password };

    return this.backendService.doPost<LoginResponse, LoginRequest>(
      `${ApiRoutes.get(ApiEndpoint.Login)}`,
      body
    );
  }

  /**
   * Saves the token to the local storage
   * @param token the token to be set
   */
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'auth_token',
        newValue: token,
      })
    );
    this._isAuthenticated.set(true);
  }

  /**
   * Retrieves the current JWT token from local storage
   * @returns {string} the current JWT token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getDecodedToken(): JwtTokenInformation | undefined {
    const token = this.getToken();
    if (token) {
      return jwtDecode<JwtTokenInformation>(token);
    }

    return undefined;
  }

  /**
   * Checks if the user is currently authenticated
   */
  checkAuthentication(): Observable<boolean> {
    const token = this.getToken();
    const isAuthenticated = token
      ? !this.jwtHelper.isTokenExpired(token)
      : false;

    if (!isAuthenticated) {
      return this.refreshToken().pipe(
        map((response) => {
          if (response?.accessToken) {
            this.saveToken(response.accessToken);
            this._isAuthenticated.set(true);
            return true;
          } else {
            this.logout();
            return false;
          }
        })
      );
    }

    this._isAuthenticated.set(true);
    return of(true);
  }

  /**
   * Refreshes the JWT token by retrieving a new token with the refresh token
   * @returns {Observable<RefreshTokenResponse>} a new and valid JWT token response
   */
  refreshToken(): Observable<RefreshTokenResponse | null> {
    return this.backendService
      .doPost<RefreshTokenResponse, Record<string, never>>(
        `${ApiRoutes.get(ApiEndpoint.RefreshJWT)}`,
        {}
      )
      .pipe(
        first(),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  /**
   * Logs the current user out, by removing the JWT token
   */
  logout(): void {
    this.backendService
      .doPost<never, Record<string, never>>(
        `${ApiRoutes.get(ApiEndpoint.Logout)}`,
        {}
      )
      .pipe(first())
      .subscribe(() => {
        this._isAuthenticated.set(false);
        localStorage.removeItem('auth_token');
        this.router.navigate([]);
      });
  }
}
