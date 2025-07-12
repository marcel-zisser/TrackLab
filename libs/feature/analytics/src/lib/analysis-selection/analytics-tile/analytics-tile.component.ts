import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tl-analytics-tile',
  imports: [],
  templateUrl: './analytics-tile.component.html',
  styleUrl: './analytics-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsTileComponent {
  title = input.required<string>();
  description= input.required<string>();
  icon = input.required<string>();
}
