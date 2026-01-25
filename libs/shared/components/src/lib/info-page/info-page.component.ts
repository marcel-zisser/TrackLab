import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tl-info-page',
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent {}
