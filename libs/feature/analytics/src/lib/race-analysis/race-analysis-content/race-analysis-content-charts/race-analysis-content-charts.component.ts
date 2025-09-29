import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceAnalysisStore } from '../../store/race-analysis.store';
import { Skeleton } from 'primeng/skeleton';
import { PositionChangesChartComponent } from '../../../charts';

@Component({
  selector: 'tl-race-analysis-content-charts',
  templateUrl: './race-analysis-content-charts.component.html',
  styleUrl: './race-analysis-content-charts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton, PositionChangesChartComponent],
})
export class RaceAnalysisContentChartsComponent {
  private readonly store = inject(RaceAnalysisStore);

  protected readonly raceSelection = this.store.raceSelection;
}
