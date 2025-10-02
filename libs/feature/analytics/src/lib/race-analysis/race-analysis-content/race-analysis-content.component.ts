import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { AnalyticsStore } from '../../store';
import { EventData } from '@tracklab/models';
import { Divider } from 'primeng/divider';
import {
  RaceAnalysisContentHeaderComponent
} from './race-analysis-content-header/race-analysis-content-header.component';
import {
  RaceAnalysisContentChartsComponent
} from './race-analysis-content-charts/race-analysis-content-charts.component';

@Component({
  selector: 'tl-race-analysis-content',
  templateUrl: './race-analysis-content.component.html',
  styleUrl: './race-analysis-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Divider,
    RaceAnalysisContentHeaderComponent,
    RaceAnalysisContentChartsComponent,
  ],
})
export class RaceAnalysisContentComponent {
  private readonly store = inject(AnalyticsStore);

  protected selectedRace: Signal<EventData | undefined> = this.store.race;
  protected selectedSession: Signal<string | undefined> = this.store.session;
}
