import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly _loggedIn = signal(false);

  get loggedIn() {
    return this._loggedIn.asReadonly();
  }
}
