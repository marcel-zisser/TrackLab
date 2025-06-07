import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@tracklab/shared/components';
import { Theme, ThemeService } from '@tracklab/services';

@Component({
  imports: [RouterModule, FooterComponent, HeaderComponent],
  selector: 'tl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  title = 'tracklab';

  constructor() {
    if (this.themeService.theme() === Theme.Dark) {
      const element = document.querySelector('html');
      element?.classList.toggle(Theme.Dark);
    }
  }
}
