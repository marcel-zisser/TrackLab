import { inject, Injectable, signal } from '@angular/core';
import {
  JwtTokenInformation,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
} from '@tracklab/models';
import { jwtDecode } from 'jwt-decode';
import { catchError, first, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiEndpoint, ApiRoutes, BackendService } from '../backend';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly backendService = inject(BackendService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly _isAuthenticated = signal(false);

  constructor() {
    if (this.jwtHelper.tokenGetter()) {
      this.checkAuthentication();
    }
  }

  /**
   * Returns a read-only signal to determine authentication status
   */
  get isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  /**
   * Logs in a user with the provided credentials
   * @param email the provided email
   * @param password the provided password
   * @returns {Observable<LoginResponse>} Observable with information about the success of the login
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email: email, password: password };

    return this.backendService.doPost<LoginResponse, LoginRequest>(
      `${ApiRoutes.get(ApiEndpoint.Login)}`,
      body,
    );
  }

  /**
   * Registers in a user with the provided data
   * @param firstName the provided first name
   * @param lastName the provided last name
   * @param email the provided email address
   * @param password the provided password
   * @returns {Observable<LoginResponse>} Observable with information about the success of the login
   */
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Observable<void> {
    const body: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    return this.backendService.doPost<void, LoginRequest>(
      `${ApiRoutes.get(ApiEndpoint.Register)}`,
      body,
    );
  }

  /**
   * Saves the token to the local storage
   * @param token the token to be set
   */
  saveToken(token: string): void {
    this.localStorageService.setItem('access_token', token);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'access_token',
        newValue: token,
      }),
    );
    this._isAuthenticated.set(true);
  }

  /**
   * Retrieves the current JWT token from local storage
   * @returns {string} the current JWT token
   */
  async getToken(): Promise<string> {
    return this.jwtHelper.tokenGetter();
  }

  async getDecodedToken(): Promise<JwtTokenInformation | undefined> {
    const token = await this.getToken();
    if (token) {
      return jwtDecode<JwtTokenInformation>(token);
    }

    return undefined;
  }

  /**
   * Checks if the user is currently authenticated
   */
  async checkAuthentication(): Promise<boolean> {
    const token = await this.getToken();
    const isAuthenticated = token
      ? !this.jwtHelper.isTokenExpired(token)
      : false;

    if (!isAuthenticated) {
      return firstValueFrom(
        this.refreshToken().pipe(
          map((response) => {
            if (response?.accessToken) {
              this.saveToken(response.accessToken);
              return true;
            } else {
              this._isAuthenticated.set(false);
              localStorage.removeItem('access_token');
              return false;
            }
          }),
        ),
      );
    }

    this._isAuthenticated.set(true);
    return true;
  }

  /**
   * Refreshes the JWT token by retrieving a new token with the refresh token
   * @returns {Observable<RefreshTokenResponse>} a new and valid JWT token response
   */
  refreshToken(): Observable<RefreshTokenResponse | null> {
    return this.backendService
      .doPost<
        RefreshTokenResponse,
        Record<string, never>
      >(`${ApiRoutes.get(ApiEndpoint.RefreshJWT)}`, {})
      .pipe(
        first(),
        catchError(() => {
          this._isAuthenticated.set(false);
          localStorage.removeItem('access_token');
          return of(null);
        }),
      );
  }

  /**
   * Logs the current user out, by removing the JWT token
   */
  logout(): void {
    this.backendService
      .doPost<never, Record<string, never>>(
        `${ApiRoutes.get(ApiEndpoint.Logout)}`,
        {},
      )
      .pipe(first())
      .subscribe(() => {
        localStorage.removeItem('access_token');
        window.location.reload();
      });
  }
}
