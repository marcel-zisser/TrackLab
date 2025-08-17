import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@tracklab/shared/components';
import { Theme, ThemeService } from '@tracklab/services';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
