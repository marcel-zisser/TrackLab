import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsStore } from './store';

@Component({
  selector: 'tl-analytics',
  imports: [RouterOutlet],
  providers: [AnalyticsStore],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {}
