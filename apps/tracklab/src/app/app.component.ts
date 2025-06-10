import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@tracklab/shared/components';
import { AuthenticationService, Theme, ThemeService } from '@tracklab/services';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  imports: [RouterModule, FooterComponent, HeaderComponent],
  providers: [JwtHelperService],
  selector: 'tl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authenticationService = inject(AuthenticationService);

  title = 'tracklab';

  constructor() {
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
