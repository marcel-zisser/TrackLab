import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private _chartTheme = signal<string>('light');

  get chartTheme() {
    return this._chartTheme.asReadonly();
  }

  /**
   * Toggles light and dark mode
   */
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');

    if (this._chartTheme() === 'light') {
      this._chartTheme.set('dark');
    } else {
      this._chartTheme.set('light');
    }
  }
}
