import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { BackendService } from '../backend/backend.service';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly backendService = inject(BackendService);

  private readonly _avatar = signal<string | undefined>(undefined);

  get avatar(): Signal<string | undefined> {
    return this._avatar.asReadonly();
  }

  constructor() {
    effect(() => {
      if (this.authenticationService.isAuthenticated()) {
        this.updateAvatar();
      }
    });
  }

  updateAvatar(): void {
    this.backendService
      .doGetBlob('user/avatar')
      .pipe(first())
      .subscribe((blob) => this._avatar.set(URL.createObjectURL(blob)));
  }
}
