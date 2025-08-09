import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserMenuService {
  private readonly _userMenuVisible = signal<boolean>(false);

  /**
   * Returns the user menu visible signal as a read only signal
   */
  get userMenuVisible(): Signal<boolean> {
    return this._userMenuVisible.asReadonly();
  }

  /**
   * Sets the visibility of the user menu according to the provided value
   * @param show the value to be set
   */
  showUserMenu(show: boolean): void {
    this._userMenuVisible.set(show);
  }

  /**
   * Toggles the visibility of the user menu
   */
  toggleUserMenu(): void {
    this._userMenuVisible.update((value) => !value);
  }
}
