import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RaceAnalysisStore } from '../store/race-analysis.store';
import { EventData } from '@tracklab/models';
import { Divider } from 'primeng/divider';
import { RaceAnalysisContentHeaderComponent } from './race-analysis-content-header/race-analysis-content-header.component';

@Component({
  selector: 'tl-race-analysis-content',
  templateUrl: './race-analysis-content.component.html',
  styleUrl: './race-analysis-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider, RaceAnalysisContentHeaderComponent],
})
export class RaceAnalysisContentComponent {
  private readonly store = inject(RaceAnalysisStore);

  protected selectedRace: Signal<EventData | undefined> = this.store.race;
  protected selectedSession: Signal<string | undefined> = this.store.session;
}
