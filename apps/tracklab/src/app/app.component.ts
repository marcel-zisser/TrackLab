import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@tracklab/components';
import { Theme, ThemeService } from '@tracklab/services';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { overwrite } from 'country-list';

@Component({
  imports: [RouterModule, FooterComponent, HeaderComponent, ConfirmDialog],
  providers: [JwtHelperService],
  selector: 'tl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  title = 'tracklab';

  constructor() {
    overwrite([
      {
        code: 'GB',
        name: 'United Kingdom',
      },
      {
        code: 'GB',
        name: 'Great Britain',
      },
      {
        code: 'US',
        name: 'United States',
      },
      {
        code: 'NL',
        name: 'Netherlands',
      },
      {
        code: 'AE',
        name: 'United Arab Emirates',
      },
      {
        code: 'AE',
        name: 'Abu Dhabi',
      },
      {
        code: 'TR',
        name: 'Turkey',
      },
      {
        code: 'RU',
        name: 'Russia',
      },
    ]);
    this.setInitialTheme();
  }

  /**
   * Sets the theme initially
   * @private
   */
  private setInitialTheme(): void {
    if (this.themeService.theme() === Theme.Dark) {
      const element = document.querySelector('html');
      element?.classList.toggle(Theme.Dark);
    }
  }
}
