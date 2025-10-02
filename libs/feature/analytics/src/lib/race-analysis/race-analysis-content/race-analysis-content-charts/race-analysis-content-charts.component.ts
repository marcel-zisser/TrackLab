import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnalyticsStore } from '../../../store';
import { Skeleton } from 'primeng/skeleton';
import {
  LeaderGapLineChartComponent,
  PositionChangesChartComponent,
  StrategyComparisonChartComponent,
} from '../../../charts';

@Component({
  selector: 'tl-race-analysis-content-charts',
  templateUrl: './race-analysis-content-charts.component.html',
  styleUrl: './race-analysis-content-charts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Skeleton,
    PositionChangesChartComponent,
    LeaderGapLineChartComponent,
    StrategyComparisonChartComponent,
  ],
})
export class RaceAnalysisContentChartsComponent {
  private readonly store = inject(AnalyticsStore);

  protected readonly raceSelection = this.store.raceSelection;
}
