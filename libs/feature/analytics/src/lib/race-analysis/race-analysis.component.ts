import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceAnalysisStore } from './store/race-analysis.store';
import { Menu } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'tl-race-analysis',
  imports: [Menu, Ripple, Badge, Avatar],
  providers: [RaceAnalysisStore],
  templateUrl: './race-analysis.component.html',
  styleUrl: './race-analysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceAnalysisComponent {
  protected readonly raceAnalysisStore = inject(RaceAnalysisStore);
}
