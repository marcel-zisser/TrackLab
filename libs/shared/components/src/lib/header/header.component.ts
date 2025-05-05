import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ButtonIcon } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { NgClass } from '@angular/common';
import { DarkModeService } from '@tracklab/services';

@Component({
  selector: 'tl-header',
  imports: [
    Menubar,
    RouterLink,
    ToggleSwitch,
    ButtonIcon,
    NgClass,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly darkModeService = inject(DarkModeService);

  items: MenuItem[] | undefined;

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
    this.darkModeService.toggleDarkMode();
  }
}
