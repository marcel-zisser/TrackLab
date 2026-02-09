import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TracklabStore } from '@tracklab/store';

@Component({
  selector: 'tl-analytics',
  imports: [RouterOutlet],
  providers: [TracklabStore],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {}
