import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceAnalysisStore } from './store/race-analysis.store';

@Component({
  selector: 'tl-race-analysis',
  providers: [RaceAnalysisStore],
  templateUrl: './race-analysis.component.html',
  styleUrl: './race-analysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceAnalysisComponent {
  protected readonly raceAnalysisStore = inject(RaceAnalysisStore);
}
