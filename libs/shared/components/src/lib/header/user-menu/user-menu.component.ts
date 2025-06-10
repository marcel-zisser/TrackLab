import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Divider } from 'primeng/divider';
import { AuthenticationService } from '@tracklab/services';

@Component({
  selector: 'tl-user-menu',
  imports: [
    Divider
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  private readonly authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService.logout();
  }
}
