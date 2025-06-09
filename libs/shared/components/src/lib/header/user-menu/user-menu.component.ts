import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'tl-user-menu',
  imports: [
    Divider
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {}
