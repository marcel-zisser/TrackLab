import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnalyticsStore } from '../../../store';
import { Skeleton } from 'primeng/skeleton';
import {
  LeaderGapBarChartComponent,
  LeaderGapLineChartComponent,
  PositionChangesChartComponent, SectorComparisonChartComponent,
  StrategyComparisonChartComponent, WdcContendersChartComponent,
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
    LeaderGapBarChartComponent,
    SectorComparisonChartComponent,
    WdcContendersChartComponent,
  ],
})
export class RaceAnalysisContentChartsComponent {
  private readonly store = inject(AnalyticsStore);

  protected readonly raceSelection = this.store.raceSelection;
}
