import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../local-storage';
import { Theme } from './theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly localStorageService = inject(LocalStorageService);

  private _theme = signal<string>(
    this.localStorageService.getItem('theme') ?? Theme.Light
  );

  private _chartTheme = computed(() =>
    this._theme() === 'dark' ? 'tracklab-dark' : ''
  );

  get theme() {
    return this._theme.asReadonly();
  }

  get chartTheme() {
    return this._chartTheme;
  }

  /**
   * Toggles light and dark mode
   */
  toggleDarkMode() {
    const element = document.querySelector('html');
    const dark = element?.classList.toggle(Theme.Dark);

    if (dark) {
      this._theme.set(Theme.Dark);
      this.localStorageService.setItem('theme', Theme.Dark);
    } else {
      this._theme.set(Theme.Light);
      this.localStorageService.setItem('theme', Theme.Light);
    }
  }
}
