import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'tl-construction',
  imports: [
    Card,
    Message,
    ButtonDirective
],
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructionComponent {
  goBack(): void {
    history.back();
  }
}
