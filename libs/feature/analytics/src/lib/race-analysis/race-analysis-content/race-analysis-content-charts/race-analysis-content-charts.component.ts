import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AnalyticsStore } from '../../../store';
import {
  LeaderGapBarChartComponent,
  LeaderGapLineChartComponent,
  PositionChangesChartComponent,
  SectorComparisonChartComponent,
  StrategyComparisonChartComponent,
  WdcContendersChartComponent,
} from '../../../charts';
import { SelectButton } from 'primeng/selectbutton';
import { millisecondsToTimingString } from '@tracklab/util';
import { FormsModule } from '@angular/forms';
import { Sector, SelectionOption } from '@tracklab/models';
import { RaceAnalysisChartTileComponent } from './race-analysis-chart-tile/race-analysis-chart-tile.component';
import { ChartTitleDirective } from '@tracklab/shared/components';

@Component({
  selector: 'tl-race-analysis-content-charts',
  templateUrl: './race-analysis-content-charts.component.html',
  styleUrl: './race-analysis-content-charts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PositionChangesChartComponent,
    LeaderGapLineChartComponent,
    StrategyComparisonChartComponent,
    LeaderGapBarChartComponent,
    SectorComparisonChartComponent,
    WdcContendersChartComponent,
    ChartTitleDirective,
    SelectButton,
    FormsModule,
    RaceAnalysisChartTileComponent,
  ],
})
export class RaceAnalysisContentChartsComponent {
  private readonly store = inject(AnalyticsStore);

  protected readonly raceSelection = this.store.raceSelection;
  protected readonly millisecondsToTimingString = millisecondsToTimingString;

  protected readonly sectors: SelectionOption<string, Sector>[] = [
    { label: 'Sector 1', value: Sector.Sector1 },
    { label: 'Sector 2', value: Sector.Sector2 },
    { label: 'Sector 3', value: Sector.Sector3 },
  ];

  protected readonly sector = signal<number>(1);
  protected readonly fastestSectorTime = signal<number | undefined>(undefined);
}
