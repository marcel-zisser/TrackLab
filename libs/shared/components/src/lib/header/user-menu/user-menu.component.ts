import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Divider } from 'primeng/divider';
import { AuthenticationService } from '@tracklab/services';
import { Router } from '@angular/router';
import { UserMenuService } from './user-menu.service';

@Component({
  selector: 'tl-user-menu',
  imports: [Divider],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly userMenuService = inject(UserMenuService);
  private readonly router = inject(Router);

  /**
   * Opens the collection page
   * @protected
   */
  protected openCollection() {
    this.router.navigate(['user', 'collection']);
    this.userMenuService.showUserMenu(false);
  }

  /**
   * Opens the settings page
   * @protected
   */
  protected openUserSettings() {
    this.router.navigate(['user', 'settings']);
    this.userMenuService.showUserMenu(false);
  }

  /**
   * Logs the user out
   * @protected
   */
  protected logout() {
    this.authenticationService.logout();
  }
}
