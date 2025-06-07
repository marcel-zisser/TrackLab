import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ButtonIcon } from 'primeng/button';
import { ToggleSwitch, ToggleSwitchChangeEvent } from 'primeng/toggleswitch';
import { NgClass } from '@angular/common';
import { Theme, ThemeService } from '@tracklab/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tl-header',
  imports: [
    Menubar,
    RouterLink,
    ToggleSwitch,
    ButtonIcon,
    NgClass,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly themeService = inject(ThemeService);

  items: MenuItem[] | undefined;
  theme = this.themeService.theme();


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
}
