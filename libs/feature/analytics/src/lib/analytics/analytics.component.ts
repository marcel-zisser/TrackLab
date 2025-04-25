import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { StandingsComponent } from '../standings/standings.component';
import { StandingsService } from '../standings/standings.service';

@Component({
  selector: 'tl-analytics',
  imports: [StandingsComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  private readonly standingsService = inject(StandingsService);

  driverStandings = this.standingsService.getDriverStandings();
  constructorStandings = this.standingsService.getConstructorStandings();
}
