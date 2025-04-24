import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  driverStandings = signal<any[]>([]);
  constructorStandings = signal<any[]>([]);

  constructor() {
    this.driverStandings.set(this.standingsService.getDriverStandings());
    this.constructorStandings.set(this.standingsService.getConstructorStandings());
  }

}
