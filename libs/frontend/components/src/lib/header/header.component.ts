import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { InputText } from 'primeng/inputtext';
import { Avatar } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'tl-header',
  imports: [
    Menubar,
    InputText,
    Avatar,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Analyze',
        icon: 'pi pi-search',
        routerLink: 'analyze'
      },
      {
        label: 'Digital Twin',
        icon: 'pi pi-sparkles',
        routerLink: 'digital-twin',
      }
    ];
  }
}
