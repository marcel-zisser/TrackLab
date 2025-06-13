import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { Button, ButtonIcon } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { NgClass } from '@angular/common';
import { AuthenticationService, Theme, ThemeService } from '@tracklab/services';
import { FormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginComponent } from '../authentication';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'tl-header',
  imports: [
    Menubar,
    RouterLink,
    ToggleSwitch,
    ButtonIcon,
    NgClass,
    FormsModule,
    Avatar,
    UserMenuComponent,
    Button,
    Toast
  ],
  providers: [DialogService, MessageService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly dialogService = inject(DialogService);

  private clickedInsideMenu = false;

  protected loggedIn = this.authenticationService.isAuthenticated;

  items: MenuItem[] | undefined;
  theme = this.themeService.theme();
  showUserMenu = signal(false);

  ngOnInit() {
    this.items = [
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: 'analytics',
      },
      {
        label: 'Pitwall Copilot',
        icon: 'pi pi-sparkles',
        routerLink: 'pitwall-copilot',
      },
    ];
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  protected readonly Theme = Theme;

  /**
   * Triggered, if user clicks anywhere inside the user menu
   * @protected
   */
  protected onMenuClick(): void {
    this.clickedInsideMenu = true;
  }

  toggleUserMenu() {
    this.clickedInsideMenu = true;
    this.showUserMenu.update((curr) => !curr);
  }

  @HostListener('document:click', ['$event'])
  handleClick() {
    if (!this.clickedInsideMenu) {
      this.showUserMenu.set(false);
    }
    this.clickedInsideMenu = false;
  }

  openLoginDialog() {
    this.dialogService.open(LoginComponent, {
      header: 'Login',
      closable: true,
      modal: true
    });
  }
}
