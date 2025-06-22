import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'tl-analytics',
  imports: [
    AutoComplete
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {}

