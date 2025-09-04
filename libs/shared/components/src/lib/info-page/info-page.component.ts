import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tl-info-page',
  imports: [CommonModule],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent {}
